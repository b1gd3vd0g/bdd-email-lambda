resource "aws_iam_role" "lambda_execution" {
  name = "lambda_execution_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "logs" {
  role       = aws_iam_role.lambda_execution.name
  policy_arn = "awn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "email_service" {
  function_name = "bigdevdog-email-service"
  role          = aws_iam_role.lambda_execution.arn
  handler       = "src/index.handler"
  runtime       = "nodejs22.x"

  filename = "bdd_email_svc.zip"

  environment {
    variables = {
      SMTP_HOST      = var.smtp_host
      EMAIL_PASSWORD = var.email_password
    }
  }
}
