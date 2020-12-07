const person = {
    email: "florencefong000@gmail.com",
    password: "FakeAccount#0",
};

describe('Login Form', async () => {
    let page;

    beforeAll(async () => {
        await page.goto('http://localhost:3000/');
    });

    test('Can submit login form', async () => {
        await page.click('button[class=userAction]');
        await page.click("input[name=email]");
        await page.type("input[name=email]", person.email);
        await page.click("input[name=password]");
        await page.type("input[name=password]", person.password);
        await page.click("input[type=checkbox]");  
        await page.click("button[type=submit]");
  
    }, 9000000);

    afterAll(async () => {
        await page.close()
    })
})