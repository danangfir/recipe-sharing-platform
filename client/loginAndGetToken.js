async function loginAndGetToken(email, password) {
    const loginResponse = await fetch('/api/cheffs/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
  
    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }
  
    const loginData = await loginResponse.json();
    return loginData.token; // Asumsikan respons berisi token JWT dalam properti `token`
  }
  
  export default loginAndGetToken;
  