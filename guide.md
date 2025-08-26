> npm install tailwindcss @tailwindcss/vite
> npm create vite@latest
> npm install react-router-dom

1. Frontend

=> Run the commands above inside the frontend folder, then set up the project as follows:

- Clear index.css and add the line `@import "tailwindcss";`
- Delete App.css
- Set up routes inside App.jsx

> npm install react-icons --save
> npm install sonner
> npm install react-toastify
> npm install react-redux @reduxjs/toolkit axios
> npm install dayjs
> npm install react-scroll-parallax
> npm add react-parallax
> npm install swiper

- Structure the Checkout files for payment.

- Go to developer.paypal.com and sign in
- In Dashboard -> Apps & Credentials -> Create App (name and create)
  > npm install @paypal/react-paypal-js
- Create PaypalButton.jsx and place it under Checkout.jsx

- Build the Admin Panel to manage products

- Create AdminLayout.jsx inside Admin folder and build the Admin Panel UI.

2. Backend

> Tools: Express, mongoose, dotenv, jsonwebtoken, bcryptjs, cors, nodemon
> Apps: MongoDB
> cd backend
> npm init -y
> npm install express mongoose dotenv jsonwebtoken bcryptjs cors nodemon
> npm install multer cloudinary streamifier

- Create a server.js file to run the server. Change the main file path in package.json to server.js and update scripts.
- Create a .env file
- Go to cloud.mongodb.com, create an account, then create a new project (name and create). Create a free cluster -> copy the password -> open Network Access -> Add IP Address -> Allow access from anywhere
- Go back to the cluster panel -> Create Database -> copy the connection string and paste into .env -> find `2arasbt.mongodb.net/` in the string and append your project name (e.g. `2arasbt.mongodb.net/rabbit`) -> Replace `<db_password>` with the DB password (from Database Access; you can auto-generate or set your own).
- Create a config folder in backend and add db.js to configure the database.
- Create a models folder in backend and add user.js to define the user model.
- Create a routes folder in backend.
- Test API with Postman: create a collection named User -> Add a request -> Rename to Register -> Method POST -> URL `http://localhost:9000/api/users/register` -> Save -> Body -> Raw -> add JSON with name,email,password and Send. If you get 200 OK it's successful.
- Then test Login: new request named Login, POST `http://localhost:9000/api/users/login`, send email+password used in Register. If it returns the created user info it's successful. Try wrong password or email to see the result.

<!-- 1. Product Backend -->
- Create Product.js in models and configure the Product model there.
- Create ProductRouter.js in routes and configure product routes.
<!-- Create Product -->
- Create a Postman collection named Products with a POST request (`http://localhost:9000/api/products`) named Create -> In Headers add Authorization: `Bearer <token>` (replace `<token>` with token from Login) -> Body -> Raw -> send product JSON and Send. If successful, check Atlas: in rabbit.products the product should have the user field set to the creator.
- In authMiddleware.js there is a comment `//Middleware to check if user is an admin` meaning non-admin creators cannot create products (tested with Postman).
<!-- Update Product -->
- Add and test Update Product with a PUT request named Update. URL `http://localhost:9000/api/products/<product_ID>`, include Authorization header as above, Body with fields to update as JSON, Send and verify DB shows updated product.
<!-- Delete Product -->
- Add delete functionality in productRoutes.js and create a DELETE request in Postman. Header same, URL with product id; after Send you should get success message and the product removed from DB.
<!-- seed.js -->
- Create seed.js in backend with two functions: reset all data (users, products, orders) or insert/update products based on products.js. It should create an admin user and assign admin user to each product. Insert sample products from /backend/data/products.js, log "Data seeded successfully!" and exit. After running, DB should show 20 products and one admin user.
> npm run seed           # update/add new products
> npm run seed reset     # reset data and create a new admin user
<!-- Filter Products -->
- Add filter functionality in productRoutes.js and create a GET method named All Products. URL `http://localhost:9000/api/products/?category=Top Wear` returns products in category Top Wear. To search multiple categories add `&` with more keys/values.
<!-- Filter Single Product -->
- Add GET `http://localhost:9000/api/products/:id` to get a product by id.
<!-- Similar Products -->
- Add GET `http://localhost:9000/api/products/similar/:id` to return similar products by id.
<!-- New Arrival Products -->
- Add GET `http://localhost:9000/api/products/new-arrivals` to return newest products by creation date.

<!-- 2. Cart Backend -->
- Create Cart.js in models -> add to seed.js and server.js -> create cartRoutes to handle requests.
<!-- CREATE api/cart -->
- Create POST request in Postman to test creating a cart with an array of products including productId,size,color,quantity -> then update by adding guestId and changing size/color/quantity. DB should attach guestId to the cart object.
<!-- UPDATE api/cart -->
- Create PUT request to test updating cart with userId, productId, size,color,quantity -> when quantity is set to 0 the product should be removed from the cart.
<!-- DELETE api/cart -->
- Create DELETE request similar to PUT but it deletes when user clicks delete on a product in cart.
<!-- GET api/cart?userId=... -->
- Create GET request to retrieve cart for userId.
<!-- MERGE api/cart/merge -->
- Run `npm run seed` to reset data and add a cart with guestId. Create POST request named Merge. Simulate login by setting Header Authorization: `Bearer <token>` (token from User Login). In Body/Raw send guestId and Send — the guest cart should be merged into the logged-in user's cart.

<!-- 3. Checkout Backend -->
- Create Order.js and Checkout.js in /models and checkoutRoutes.js in /routes
- Create a Checkout collection in Postman. Create POST request, simulate login, send raw JSON with fields: checkoutItems[{productId,name,image,price}], shippingAddress{address,city,postalCode,country}, paymentMethod,totalPrice. Send to create an order.
- Create PUT request named Pay. Simulate login, URL `http://localhost:9000/api/checkout/:id/pay` then add the order ObjectId value in Params (from Atlas), and raw body like:
  { "paymentStatus":"paid", "paymentDetails":{"transactionId":"...","paymentGateway":"PayPal","amount":19,"currency":"USD"} }
  Send to update order status to paid.
- Duplicate and create `http://localhost:9000/api/checkout/:id/finalize`, leave raw empty and Send.

<!-- 4. Order Backend -->
- Create orderRoutes in /routes.
- Create GET request in a new Postman collection named Order: URL `http://localhost:9000/api/orders/my-orders`, simulate login to get all orders of logged-in user.
- Duplicate that request and change URL to `http://localhost:9000/api/orders/:id`, put an order _id in Params and Send to get one order details for the logged-in user.

<!-- 5. Cloudinary: image upload handling -->
- Install cloudinary in backend
- Add 3 keys to .env
- Create uploadRoutes.js in /routes
- Create POST request in Upload collection named Create with URL `http://localhost:9000/api/upload`, simulate login. Body -> form-data, key=image (type File), choose a local image and Send. Result will be an image URL uploaded to Cloudinary.

<!-- 6. Subscriber email -->
- Create Subscriber.js in models and subscriberRoutes.js in routes
- Create POST request in Subscriber collection named Create. URL `http://localhost:9000/api/subscribe`, simulate login, send email in Body/Raw. Result: email saved to database. Basic email validation is implemented.

<!-- 7. Admin Backend -->
- Create adminRoutes.js in /routes
<!-- GET /api/admin/users: list users -->
- Create GET request in Postman `http://localhost:9000/api/admin/users`, simulate login, returns all users.
<!-- POST /api/admin/users: create user -->
- Create POST request `http://localhost:9000/api/admin/users`, simulate login, Body/Raw: {name,email,password}. Result: new user created.
<!-- PUT /api/admin/users/:id: update user -->
- Create PUT request `http://localhost:9000/api/admin/users/:id`, set Params to user ObjectId, simulate login, Body/Raw: {name,email}. Result: user updated.
<!-- DELETE /api/admin/users/:id: delete user (admin only) -->
- Create DELETE request `http://localhost:9000/api/admin/users/:id`, set Params to user ObjectId, simulate login, result: user deleted from DB.

<!-- 8. Product Admin Backend -->
- Create productAdminRoutes.js in /routes
<!-- GET /api/admin/products: list products -->
- Create GET request `http://localhost:9000/api/admin/products`, simulate login, returns all products.

<!-- 9. Order Admin Backend -->
- Create adminOrderRoutes.js in /routes
<!-- GET /api/admin/orders: list orders -->
- Create GET request `http://localhost:9000/api/admin/orders`, simulate login, returns all orders.
<!-- DELETE /api/admin/orders/:id -->
- Create DELETE request `http://localhost:9000/api/admin/orders/:id`, set Params to order ObjectId, simulate login, result: order deleted.

3. Back to Frontend:
- Install Redux and add a store.js + a slices folder inside /src/redux
- In slices create authSlice.js, configure Redux there. Wrap Provider around App.jsx to enable Redux across the app. In components like Login, Register import `import { loginUser } from "../redux/slices/authSlice";` and `import { useDispatch } from "react-redux";` then use dispatch() to call Redux actions in submit handlers. Create additional slices for cart, product, user, etc. and import them into store.js.
- NewArrivals.jsx: replace with fetchNewArrivals
- Home.jsx -> ProductGrid.jsx -> ProductDetails.jsx: refactor and add Redux
- CollectionPage.jsx: configure Redux for filter page.
- NavBar.jsx: update cart button so product count updates correctly on add/remove
- CartDrawer.jsx + CartContent.jsx: handle adding to cart
- SearchBar.jsx: implement product search button
- Login.jsx: handle login process
- Profile.jsx: show user info and Logout button in Profile page with confirm logout modal
- Register.jsx: handle register process and errors
- Checkout.jsx: handle payments
- OrderConfirmationPage.jsx: handle successful checkout order
- MyOrdersPage.jsx: display list of user orders
- OrderDetailsPage.jsx: show order details
- ProtectedRoute.jsx: show admin-only UI if role:"admin", then include in App.jsx
- AdminHomePage.jsx: UI for Admin Panel home
- AdminSideBar.jsx: UI for Admin Panel sidebar
- UserManagement.jsx: UI tab to manage users in Admin Panel
- OrderManagement.jsx: UI tab to manage orders in Admin Panel (adminOrderRoutes.js + adminOrderSlice.js)
- ProductManagement.jsx: UI tab to manage products in Admin Panel (productRoutes.js + productAdminSlice.js)
- EditProductPage.jsx: UI to edit product within Admin Panel (ProductManagement.jsx + productSlice.js)

<!-- 10. Deploy to Vercel -->
- Create vercel.json files in /backend and /frontend and a .gitignore in the root
- /backend: Install Vercel CLI and deploy: `npm install -g vercel` && `vercel --prod`
- /frontend: Deploy via GitHub and import to Vercel, set Root Directory to /frontend and add environment variables from /frontend/.env to Vercel Environment Variables (do not push .env to GitHub). Note: set VITE_BACKEND_URL to the deployed backend URL (deploy backend first). Remove trailing "/" from the backend URL to avoid double "//".
- In root run:
> git init
> git add .
> git remote add origin https://github.com/baosu123/fashion-website.git
> git commit -m "first commit"
> git branch -M main
> git push -u origin main

<!-- 11. How to use Redux to fetch data -->
Step 1: Create backend route
- In productRoutes.js, create a route `/api/products` to return data filtered as needed.
Step 2: Create Async Thunk and handle state
- In productSlice.js create an async thunk to fetch data from the API.
- Add extraReducers cases for pending, fulfilled, rejected.
Step 3: Dispatch from component
- In SaleProduct.jsx use dispatch() to call the async thunk and display the data in UI.

<!-- 12. Missing features -->
- Variant support per color/size:
variants: [
      { size: 'S', color: 'Black', countInStock: 5 },
      { size: 'S', color: 'White', countInStock: 3 },
      ...
    ],

<!-- 13. Toast message -->
> npm install sooner
- import into App.jsx and add it at the end of the container.
- 
