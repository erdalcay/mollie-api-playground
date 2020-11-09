# Mollie API Playground

A demo app to get started with discovering **Mollie's** payment APIs.

![Admin View](https://res.cloudinary.com/erdal-cay/image/upload/v1604900263/images/admin_apjmiz.jpg)

----

This fictionary grocery shop is a quick interaction with Mollie's payment APIs -quick, hence the limited implementation- and is made up of two pages: 

- A product page where you can initiate and complete a test ***payment***.
- An admin dashboard where you can fetch some data directly from the **Mollie API** for a demo account (ID: **#10605257**).

To give it a look, simply go to https://solutiongineer.com on your desktop device, preferably using a Chrome window, and click on every button (there are only a few of them, don't worry!). You'll see something like this:

![Shop](https://res.cloudinary.com/erdal-cay/image/upload/v1604900260/images/shop_mlakvv.jpg)


- First, complete a test payment by choosing a status of your wish.
- Then click on the needy, attention-seeker, jumping button on bottom right to go to the admin dashboard. A lot of UI elements here do not respond to interactions - your best bet is to click on the menu items on the left-navigation bar.

### API Implementation

Although Mollie has an [official package for Node](https://github.com/mollie/mollie-api-node), what has been chosen for this demonstration is a light-weight implementation of Mollie's four API endpoints since getting one's own hands dirty with low level stuff is the best way to learn a new thing in great detail.

APIs the demo app communicates with:

&nbsp;&nbsp;&nbsp;&nbsp;`Payments API`, `Orders API`, `Refunds API`, `Methods API`

```javascript

...

class MollieClient extends HTTPClient {
  
  constructor(host = 'api.mollie.com', apiKey = process.env.MOLLIE_API_KEY, serverName = process.env.SERVER_NAME) {
    super();
    this.host = host;
    this.apiKey = apiKey;
    this.serverName = serverName;
  }
}

...

```


#### Disclaimer

Both the shop and the admin page uses freemium or open source front-end elements - including HTML, CSS, JS and other assets. 
Authors/creators of the material that has been used in this repository are being credited with direct links to their respective web sites in each document that requires a copy right to 3rd parties.

