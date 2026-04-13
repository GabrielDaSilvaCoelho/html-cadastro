import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import bcrypt from "https://esm.sh/bcryptjs@2.4.3"

const supabaseUrl = "https://dmfnfiklehsgtrlcmyhl.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtZm5maWtsZWhzZ3RybGNteWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NDE5MjksImV4cCI6MjA4NjIxNzkyOX0.60pjZ6FvJXf40J5_hyNbAJ9W8wOot4JWL97353-6ZRI"
const supabase = createClient(supabaseUrl, supabaseKey)

const btnCadastrar = document.getElementById("btnCadastrar")
const msg = document.getElementById("msg")

btnCadastrar.addEventListener("click", cadastrar)

function limparErros() {
  document.querySelectorAll("input").forEach((input) => {
    input.classList.remove("error")
  })
  msg.className = "msg"
  msg.innerText = ""
}

function mostrarErro(texto, campos = []) {
  msg.className = "msg error"
  msg.innerText = texto
  campos.forEach((campo) => campo.classList.add("error"))
}

function mostrarSucesso(texto) {
  msg.className = "msg success"
  msg.innerText = texto
}

async function cadastrar() {
  limparErros()
  btnCadastrar.disabled = true

  const nome = document.getElementById("nome")
  const cpf = document.getElementById("cpf")
  const telefone = document.getElementById("telefone")
  const email = document.getElementById("email")
  const senha = document.getElementById("senha")
  const confirmarSenha = document.getElementById("confirmarSenha")

  const nomeValue = nome.value.trim()
  const cpfValue = cpf.value.trim()
  const telefoneValue = telefone.value.trim()
  const emailValue = email.value.trim()
  const senhaValue = senha.value.trim()
  const confirmarSenhaValue = confirmarSenha.value.trim()

  if (!nomeValue || !cpfValue || !emailValue || !senhaValue || !confirmarSenhaValue) {
    mostrarErro("Preencha todos os campos obrigatórios.", [nome, cpf, email, senha, confirmarSenha])
    btnCadastrar.disabled = false
    return
  }

  if (senhaValue.length < 6) {
    mostrarErro("A senha deve ter pelo menos 6 caracteres.", [senha])
    btnCadastrar.disabled = false
    return
  }

  if (senhaValue !== confirmarSenhaValue) {
    mostrarErro("As senhas não coincidem.", [senha, confirmarSenha])
    btnCadastrar.disabled = false
    return
  }

  try {
    const { error: authError } = await supabase.auth.signUp({
      email: emailValue,
      password: senhaValue
    })

    if (authError) {
      mostrarErro("Erro no cadastro: " + authError.message, [email, senha])
      btnCadastrar.disabled = false
      return
    }

    const senhaHash = await bcrypt.hash(senhaValue, 10)

    const { error: erroInsert } = await supabase
      .from("usuario")
      .insert([
        {
          nome: nomeValue,
          cpf: cpfValue,
          telefone: telefoneValue,
          email: emailValue,
          senha_hash: senhaHash
        }
      ])

    if (erroInsert) {
      mostrarErro("Erro ao salvar dados: " + erroInsert.message)
      btnCadastrar.disabled = false
      return
    }

    mostrarSucesso("Cadastro realizado com sucesso!")

    nome.value = ""
    cpf.value = ""
    telefone.value = ""
    email.value = ""
    senha.value = ""
    confirmarSenha.value = ""
  } catch (err) {
    mostrarErro("Erro inesperado: " + err.message)
  } finally {
    btnCadastrar.disabled = false
  }
}