import './Home.css'

function Home() {
  
  return (
    
    // <div className="container">
    //   <h1>SISVE</h1>
    //   <p>Sistema de Vendas e Estoque</p>

    //   {/* <button>Username</button>
    //   <button>Senha</button> */}

    //   <input type="text" name="Username" />
    //   <input type="text" name="Senha" />

    //   {/* <p>Cadastre sua loja!</p> */}
    //   {/* <button type="button">Cadastrar</button> */}
    //   {/* <style>
    //     @import url('https://fonts.googleapis.com/css2?family=Limelight&display=swap');
    //   </style> */}


    // </div>

    

    <div>

      <div className="cadastro">
      <p>Ainda não possui uma conta?</p>
        <button>Cadastra-se</button> 
      </div>

      <div className="container">
        <h1>SISVE</h1>
        <p>Sistema de Vendas e Estoque</p>
      </div>

      <div className='Login'>
        <h3>Login</h3>
        <p>Username</p>
        <input type="text" name="Username" />

        <p>Senha</p>
        <input type="text" name="Senha" />
        <button>Login</button>
        {/* <p>Ainda não possui uma conta?</p>
        <button>Cadastra-se</button> */}
      </div>

    </div>

    // <div className="Home">
    //   <div>
    //     <a href="https://vitejs.dev" target="_blank">
    //       <img src="/vite.svg" className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://reactjs.org" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>SISVE</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/Home.jsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </div>
  )
}

export default Home
