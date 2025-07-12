resource "aws_apigatewayv2_api" "email_api" {
  name          = "bdd-email-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = [
      "https://${local.website_domain}",
      "https://www.${local.website_domain}"
    ]
    allow_methods     = ["OPTIONS", "POST"]
    allow_headers     = ["Content-Type"]
    max_age           = 3600
    allow_credentials = true
  }
}

resource "aws_lambda_permission" "invoke_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.email_service.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.email_api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.email_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.email_service.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "send_contact_form_email" {
  api_id    = aws_apigatewayv2_api.email_api.id
  route_key = "POST /contact"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.email_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_domain_name" "api_root" {
  domain_name = local.api_domain

  domain_name_configuration {
    certificate_arn = aws_acm_certificate_validation.cert_validation.certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_domain_name" "api_www" {
  domain_name = "www.${local.api_domain}"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate_validation.cert_validation.certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "mapping_root" {
  api_id      = aws_apigatewayv2_api.email_api.id
  domain_name = aws_apigatewayv2_domain_name.api_root.id
  stage       = aws_apigatewayv2_stage.default.name
}

resource "aws_apigatewayv2_api_mapping" "mapping_www" {
  api_id      = aws_apigatewayv2_api.email_api.id
  domain_name = aws_apigatewayv2_domain_name.api_www.id
  stage       = aws_apigatewayv2_stage.default.name
}

resource "aws_route53_record" "api_root" {
  zone_id = var.route_53_hosted_zone_id
  name    = local.api_domain
  type    = "A"

  alias {
    name                   = aws_apigatewayv2_domain_name.api_root.domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.api_root.domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "api_www" {
  zone_id = var.route_53_hosted_zone_id
  name    = "www.${local.api_domain}"
  type    = "A"

  alias {
    name                   = aws_apigatewayv2_domain_name.api_www.domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.api_www.domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}
