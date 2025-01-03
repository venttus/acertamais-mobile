export function passwordValidator(password) {
  if (!password) return "Por favor, preencha este campo."
  if (password.length < 8) return 'A senha deve conter pelo menos 8 caracteres.'
  return ''
}
