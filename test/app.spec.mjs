import chai from 'chai';
import chaiHttp from 'chai-http';
import { app, server } from '../backend/index.js';
import { Book } from '../backend/models/bookModel.js';

const { expect } = chai;

chai.use(chaiHttp);

describe('POST /books', () => {
  after(() => {
    // Close the server after all tests are done
    server.close();
  });

  beforeEach(async () => {
    // No need to clear the collection for this example
  });

  it('should create a new book', async () => {
    const bookData = {
      title: 'Test Book',
      author: 'Test Author',
      publishYear: 2022,
    };

    const res = await chai
      .request(app)
      .post('/books')
      .send(bookData);

    // Expect a successful response with a 201 status code
    expect(res).to.have.status(201);

    // Expect the response body to have the expected title
    expect(res.body).to.have.property('title', 'Test Book');
  });

  it('should return an error for incomplete data', async () => {
    const bookData = {
      title: 'Test Book',
    };

    const res = await chai
      .request(app)
      .post('/books')
      .send(bookData);

    // Expect a validation error response with a 400 status code
    expect(res).to.have.status(400);

    // Expect the response body to contain the expected error message
    expect(res.body).to.have.property('message', 'Send all required fields: title, author, publishYear');
  });
});

describe('GET /books', () => {
  // Assuming there are some books already in the database
  beforeEach(async () => {
    // Clear existing books and add some initial books for testing
    await Book.deleteMany({});
    await Book.create([
      { title: 'Book 1', author: 'Author 1', publishYear: 2020 },
      { title: 'Book 2', author: 'Author 2', publishYear: 2021 },
      // Add more books as needed
    ]);
  });

  it('should get all books', async () => {
    const res = await chai.request(app).get('/books');

    // Expect a successful response with a 200 status code
    expect(res).to.have.status(200);

    // Expect the response body to be an array
    expect(res.body.data).to.be.an('array'); // Change this line

    // Optionally, you can check specific properties of the books
    expect(res.body.data[0]).to.have.property('title', 'Book 1'); // Change this line
    expect(res.body.data[1]).to.have.property('title', 'Book 2'); // Change this line
  });

  it('should return an empty array if no books are found', async () => {
    // Assuming the database is empty
    await Book.deleteMany({});

    const res = await chai.request(app).get('/books');

    // Expect a successful response with a 200 status code
    expect(res).to.have.status(200);

    // Expect the response body to be an empty array
    expect(res.body.data).to.be.an('array').that.is.empty; // Change this line
  });
});




describe('GET /books/:id', () => {
  let bookId;

  beforeEach(async () => {
    // Create a book in the database and store its ID for testing
    const newBook = await Book.create({
      title: 'Book for testing',
      author: 'Test Author',
      publishYear: 2022,
    });

    bookId = newBook._id;
  });

  it('should get a book by its ID', async () => {
    const res = await chai.request(app).get(`/books/${bookId}`);

    // Expect a successful response with a 200 status code
    expect(res).to.have.status(200);

    // Expect the response body to be an object with properties of the book
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('title', 'Book for testing');
    expect(res.body).to.have.property('author', 'Test Author');
    expect(res.body).to.have.property('publishYear', 2022);
  });

  it('should return a 404 status if the book ID is not found', async () => {
    // Assuming a non-existing book ID
    const nonExistingId = '60a6f834e0af5f0012b530b3';
  
    const res = await await chai.request(app).get(`/books/${nonExistingId}`);
  
    // Expect a 404 status code
    expect(res).to.have.status(404);
  
    // Expect an error message in the response body
    expect(res.body).to.have.property('message', 'Book not found');
  });
  
  // it('should return a 404 status if the book ID is invalid', async () => {
  //   // Assuming an invalid book ID format
  //   const invalidId = 'invalid_id';
  
  //   const res = await await chai.request(app).get(`/books/${invalidId}`);
  
  //   // Expect a 404 status code
  //   expect(res).to.have.status(404);
  
  //   // Expect an error message in the response body
  //   expect(res.body).to.have.property('message', 'Invalid book ID');
  // });
  
});

describe('DELETE /books/:id', () => {
  let bookId;

  beforeEach(async () => {
    // Create a book in the database and store its ID for testing
    const newBook = await Book.create({
      title: 'Book for testing',
      author: 'Test Author',
      publishYear: 2022,
    });

    bookId = newBook._id;
  });

  it('should delete a book by its ID', async () => {
    const res = await chai.request(app).delete(`/books/${bookId}`);

    // Expect a successful response with a 200 status code (you can use 204 if your server sends 204)
    expect(res).to.have.status(200);

    // Optionally, you can check if the book is deleted from the database
    const deletedBook = await Book.findById(bookId);
    expect(deletedBook).to.be.null;
  });

  // it('should return a 404 status if the book ID is not found', async () => {
  //   // Assuming a non-existing book ID
  //   const nonExistingId = '60a6f834e0af5f0012b530b3';

  //   const res = await chai.request(app).delete(`/books/${nonExistingId}`);

  //   // Expect a 404 status code
  //   expect(res).to.have.status(404);

  //   // Expect an error message in the response body
  //   expect(res.body).to.have.property('error', 'Book not found');
  // });

  // it('should return a 404 status if the book ID is invalid', async () => {
  //   // Assuming an invalid book ID format
  //   const invalidId = 'invalid_id';

  //   const res = await chai.request(app).delete(`/books/${invalidId}`);

  //   // Expect a 404 status code
  //   expect(res).to.have.status(404);

  //   // Expect an error message in the response body
  //   expect(res.body).to.have.property('error', 'Invalid book ID');
  // });
});
