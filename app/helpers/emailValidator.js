export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/
  if (!email) return "Por favor, preencha este campo."
  if (!re.test(email)) return 'Por favor, insira um endereço de e-mail válido!'
  return ''
}