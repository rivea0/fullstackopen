describe('Blog app', function() {
  beforeEach(function() {
    // Empty the database
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)

    // Create a user for the backend
    const user = {
      name: 'Dale Cooper',
      username: 'cooper',
      password: 'damnfinecoffee'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

    cy.visit('/')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#login-button').should('be.visible')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('cooper')
      cy.get('#password').type('damnfinecoffee')
      cy.get('#login-button').click()
  
      cy.contains('Dale Cooper logged in')        
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('cooper')
      cy.get('#password').type('123456')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.contains('Dale Cooper logged in').should('not.exist')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'cooper', password: 'damnfinecoffee' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#new-blog-title').type('The Two Reacts')
      cy.get('#new-blog-author').type('Dan Abramov')
      cy.get('#new-blog-url').type('https://overreacted.io/the-two-reacts/')
      cy.get('#create-blog-button').click()

      cy.get('#all-blogs')
        .should('contain', 'The Two Reacts')
        .and('contain', 'Dan Abramov')
    })

    describe('And a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Proving Binaries',
          author: 'Jim Nielsen',
          url: 'https://blog.jim-nielsen.com/2025/proving-binaries/',
          likes: 10
        })
      })

      it('The blog can be liked', function() {
        cy.contains('view').click()
        cy.get('.likes').should('contain', '10')
  
        cy.contains('like').click()
        cy.get('.likes').should('contain', '11')
      })

      it('The blog can be deleted', function() {
        cy.get('.blogTitleAndAuthorInfo')
          .should('contain', 'Proving Binaries')
          .and('contain', 'Jim Nielsen')

        cy.contains('view').click()
        cy.contains('remove').click()
        cy.get('.blogTitleAndAuthorInfo').should('not.exist')
        // Timeout for more than 5 seconds as the notification for removing the blog will contain title and author name
        cy.contains('Proving Binaries', { timeout: 6000 }).should('not.exist')
        cy.contains('Jim Nielsen', { timeout: 6000 }).should('not.exist')
      })

      it('The remove button for it can only be shown to the user who created it', function() {
        // Create new user
        const user = {
          name: 'Audrey Horne',
          username: 'audrey',
          password: 'twinpeaks'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
        cy.login({ username: 'audrey', password: 'twinpeaks' })

        cy.contains('view').click()
        cy.contains('remove').should('not.exist')
      })
    })

    describe('And multiple blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Tao of Node',
          author: 'Alex Kondov',
          url: 'https://alexkondov.com/tao-of-node/',
          likes: 13
        })
        cy.createBlog({
          title: 'TypeScript enums',
          author: 'Alex Raushmayer',
          url: 'https://2ality.com/2025/01/typescript-enum-patterns.html',
          likes: 21
        })
        cy.createBlog({
          title: 'A Chain Reaction',
          author: 'Dan Abramov',
          url: 'https://overreacted.io/a-chain-reaction/',
          likes: 20
        })
      })

      it('Blogs are ordered by likes, from most likes to least', function() {
        cy.get('.blog').eq(0).contains('TypeScript enums')
        cy.get('.blog').eq(1).contains('A Chain Reaction')
        cy.get('.blog').eq(2).contains('Tao of Node')

        cy.get('.blog').eq(1).find('.detailsButton').click()

        // Make the blog be the first one
        cy.get('.blog').eq(1).find('.likeButton').click()
        cy.wait(500)
        cy.get('.blog').eq(1).find('.likeButton').click()

        cy.get('.blog').eq(0).contains('A Chain Reaction')
        cy.get('.blog').eq(1).contains('TypeScript enums')
        cy.get('.blog').eq(2).contains('Tao of Node')
      })
    })
  })
})
