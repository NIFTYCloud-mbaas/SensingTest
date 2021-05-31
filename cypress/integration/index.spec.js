describe('Sensing Test App', function () {
    var lat = 10.7723266
    var lng = 106.62461289999999
    var x = 0.1149609375
    var y = 5.149142303466797
    var z = 8.130642242431641

    beforeEach(() => {
        cy.viewport('iphone-x')
        cy.visit('http://localhost:8080', fakeLocation(lat, lng))
    })

    it('Handling UI home screen', function () {
        cy.get('Center').find('h1').contains('Sensing Test App').should('have.text', 'Sensing Test App')
        cy.get('Center').find('a').contains('加速度センサー').should('have.text', '加速度センサー')
        cy.get('Center').find('a').contains('ＧＰＳセンサー').should('have.text', 'ＧＰＳセンサー')
    })

    it('Handling 加速度センサー - Input value', function () {
        cy.get('Center').find('a').contains('加速度センサー').click()
        cy.get('INPUT[name="x"]').type(x, { delay: 100 }).should('have.value', x)
        cy.get('INPUT[name="y"]').type(y, { delay: 100 }).should('have.value', y)
        cy.get('INPUT[name="z"]').type(z, { delay: 100 }).should('have.value', z)

        cy.get('#acce_start-button').should('have.value', 'Start')
        cy.get('#acce_stop_button').should('have.value', 'Stop')
        cy.get('a').contains('戻る').should('have.text', '戻る')
        cy.get('a').contains('戻る').click()
    })

    it('Handling ＧＰＳセンサー - Input value, get location values', function () {
        cy.get('Center').find('a').contains('ＧＰＳセンサー').click()
        cy.get('#gps_start-button').should('have.value', 'Start')
        cy.get('#gps_stop_button').should('have.value', 'Stop')
        cy.get('#gps_start-button').click()
        cy.wait(1000)
        cy.get('INPUT[name="lat"]').should('have.value', lat)
        cy.get('INPUT[name="lng"]').should('have.value', lng)
        cy.get('#canvas').should('be.visible')
        cy.get('a').contains('戻る').should('have.text', '戻る')
        cy.get('a').contains('戻る').click()
    })
})

// Fake location user
function fakeLocation(latitude, longitude) {
    return {
      onBeforeLoad(win) {
        cy.stub(win.navigator.geolocation, "getCurrentPosition", (cb, err) => {
          if (latitude && longitude) {
            return cb({ coords: { latitude, longitude } });
          }
          throw err({ code: 1 }); // 1: rejected, 2: unable, 3: timeout
        });
      }
    };
}