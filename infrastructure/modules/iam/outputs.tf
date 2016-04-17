output "lambda_function_role_arn" {
  value = "${aws_iam_role.lambda_function_role.arn}"
}