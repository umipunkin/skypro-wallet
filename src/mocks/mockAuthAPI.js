export const mockAuthAPI = {
  users: [
    {
      id: 1,
      name: 'admin',
      email: 'admin@test.ru',
      password: '12345678',
    },
  ],

  async login(credentials) {
    await this.delay()

    const user = this.users.find(
      (u) => u.email === credentials.email && u.password === credentials.password,
    )

    if (!user) throw new Error('Invalid credentials')

    return {
      user: { id: user.id, email: user.email, name: user.name },
      token: this.generateValidJWT(user),
    }
  },

  async register(userData) {
    await this.delay()

    if (this.users.some((u) => u.email === userData.email)) {
      throw new Error('Email уже используется')
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      created: new Date().toISOString(),
    }

    this.users.push(newUser)

    return {
      user: { id: newUser.id, ...newUser },
      token: this.generateValidJWT(newUser),
    }
  },

  generateValidJWT(user) {
    const header = this.base64Encode({
      alg: 'HS256',
      typ: 'JWT',
    })

    const payload = this.base64Encode({
      sub: user.id,
      name: user.name,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 3600,
    })

    return `${header}.${payload}.MOCK_SIGNATURE`
  },

  base64Encode(obj) {
    return btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  },

  delay() {
    return new Promise((resolve) => setTimeout(resolve, 500))
  },
}
