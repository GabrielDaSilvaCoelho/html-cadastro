import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import bcrypt from "https://esm.sh/bcryptjs@2.4.3"

const supabaseUrl = "https://dmfnfiklehsgtrlcmyhl.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtZm5maWtsZWhzZ3RybGNteWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NDE5MjksImV4cCI6MjA4NjIxNzkyOX0.60pjZ6FvJXf40J5_hyNbAJ9W8wOot4JWL97353-6ZRI"
const supabase = createClient(supabaseUrl, supabaseKey)

document.getElementById("btnCadastrar").addEventListener("click", cadastrar)

async function cadastrar() {
  const nome = document.getElementById("nome").value.trim()
  const cpf = document.getElementById("cpf").value.trim()
  const telefone = document.getElementById("telefone").value.trim()
  const email = document.getElementById("email").value.trim()
  const senha = document.getElementById("senha").value.trim()
  const msg = document.getElementById("msg")

  msg.innerText = ""

  if (!nome || !cpf || !email || !senha) {
    msg.innerText = "Preencha todos os campos obrigatórios!"
    return
  }

  try {
    const { error: authError } = await supabase.auth.signUp({
      email: email,
      password: senha
    })

    if (authError) {
      msg.innerText = "Erro no cadastro: " + authError.message
      return
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const { error: erroInsert } = await supabase
      .from("usuario")
      .insert([
        {
          nome: nome,
          cpf: cpf,
          telefone: telefone,
          email: email,
          senha_hash: senhaHash
        }
      ])

    if (erroInsert) {
      msg.innerText = "Erro ao salvar dados: " + erroInsert.message
      return
    }

    msg.innerText = "Cadastro realizado com sucesso!"
  } catch (err) {
    msg.innerText = "Erro inesperado: " + err.message
  }
}