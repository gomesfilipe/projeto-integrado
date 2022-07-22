import './Home.css'

function Home() {
  
  return ( 

    <div>
      <div class="linha">
        <div class="coluna-50">
           <h1>SISVE</h1>
           <h2>Sistema de Vendas e Estoque</h2>
           <p>Um sistema criado para facilitar a vida do empreendedor brasileiro.</p>
           <p>O sisve é uma plataforma gratuita criada para ajudar o pequeno empreendedor brasileiro a lidar melhor com seus estoques e conhecer um pouco mais sobre suas vendas e seu faturamento. </p>
           <h3>Ainda não possui uma conta?</h3>
           <button>Cadastre-se !</button> 
        </div>

        <div class="coluna-100">
          <h2>Já Sou cadastrado</h2>
          <h3>Acessar a minha loja</h3>
          
          <label for="username">Username:</label>
          <br />
          <input type="text" placeholder="Digite o seu nome de usuário"/>
          <br />
          <label for="senha">Senha:   </label>
          <br />
          <input type="password" placeholder="digite sua senha"/>
          <br />
          <button>Entrar</button> 
        </div>
      </div>
    </div>
  )
}

export default Home