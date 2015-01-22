# Step 1 - The Application

To demonstrate different components of an Angular app, we'll be developing a shopping cart application. We'll
be treating this (as much as possible) like a real-world application. Here's the specifications for our shopping cart:

 - It must integrate with a REST-ful API to synchronize the contents of the user's cart.
 - It must allow the user to modify the contents of their cart before they submit the order.
 - It must validate all input before checkout.
 - After placing a successful order, it should direct the user towards their next steps.

We'll break down the structure of the application into its various services, controllers, and directives. Then, we'll
walk through the implementation of each component. You'll find the source in one Javascript file in this tutorial's repository.
We'll break this apart into multiple components in Step 2.


## Services

Before we design the service infrastructure for our checkout page, let's look at the requirements. We must:
 - Interact with the store's API to synchronize the contents of the cart.
 - Place orders through the API.
 - Validate all user input (credit cards, addresses, completion of form)

Each component of this can be broken into a service. By handling each concern separately, we can increase the modularity
of our application. The shopping cart service, for example, can be included in other pages of the store without needing
the knowledge of how to place orders, or validate credit cards. We'll combine these various services in the controllers
of our application.

This leaves us with four services:

### OrderService
A service which can take payment information and an inventory, and place an order with the API.

### ShoppingCart
A single source of truth for the contents of the shopping cart. This tracks and updates the contents of the user's
cart throughout their visit to the store. It also provides controllers with a calculation of the cart's cost.

### BankTeller
The purpose of the bank teller is to validate payment information.

### PostOffice
The purpose of the post office is to provide validation for international addresses.


Since we're more interested in the structure of an application than the individual pieces, we'll just do a quick mockup
of the work each of these may entail.


#### OrderService:

    // For the purposes of our demonstration, the OrderService always returns a completed order.
    // A real world application would be tied to an API via $http or $resource.


#### ShoppingCart

    // The shopping cart in this example uses a script tag to load the cart data. In a real world
    // application, this would be handled by $http or $resource.

#### BankTeller

    // Simply ensure that the correct number of digits are present in each field of the credit card.

#### PostOffice

    // Like the BankTeller, this service just ensures that each field is filled out as required, filling
    // in blanks when neccesary.


## Controllers and Directives

Controllers in Angular applications serve as binding points between API services, and user interaction. There are
often many controllers in an Angular application which serve different purposes. Some controllers are tied to directives
primarily. For this application, we will be tying a directive to each Controller.

As we did with services, let's look at our requirements:

 - We must allow modification of cart contents.
 - User input must be validated.
 - Successful orders should prompt the user with next steps (eg, 'We sent you a confirmation email')

Again, we'll employ the single responsibility principle to break this down into its components. We'll make a controller
which only handles the contents of the shopping cart. We'll make some directive controllers which handle the interaction
and validation of credit card, and address input fields. For the sake of simplicity, we'll handle user prompts with the
ever elegant
    window.alert()

#### StoreCheckoutController and <store-checkout>
    // This controller interacts with the various services to get the shopping cart for the page and synchronize
    // presents the front end with a method which finalizes the order. This service instructs the user as to their next
    // steps.

#### ShoppingCartController and <shopping-cart>
    // The Shopping Cart controller provides functionality to manage the contents of a shopping cart. It interacts with
    // ShoppingCart (the service) to feed pricing totals to the user.

#### CartItemController and <cart-item>
    // Cart Item Controller works in conjunction with <shopping-cart>. Cart Item displays product sub-totals, and modify
    // the order on a line-item basis.

#### CreditCardEntryController and <credit-card-entry>
    // This handles getting credit card input from the user. It uses ng-model to interact with a CreditCard data type.

#### AddressEntryController and <address-entry>
    // Similar to CreditCardEntryController, this directive works with ng-model to interact with an Address data type.

