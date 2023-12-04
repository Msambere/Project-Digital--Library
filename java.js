const myLibrary = [];
const shelf =document.querySelector('.book-list');

class Book{
    constructor(title, author, numPages, status){
        this.title = title;
        this.author = author;
        this.numPages = numPages;
        this.status = status;
        this.info = function(){
        return (`${this.title} by ${this.author} is ${this.numPages} pages long. Status: ${this.status}`);
        };
    };
};


const book1 = new Book("8 rules of love", "Jay Shetty","300", "reading");
myLibrary.push(book1);
const book2 = new Book("The Way of Kings", "Brandon Sanderson","987", "read");
myLibrary.push(book2);
const book3 = new Book("The Jazz of Physics", "Some guy","562", "yet to read");
myLibrary.push(book3);



populateShelf();

const showButton = document.getElementById("showDialog");
const newBookDialog = document.getElementById("newBookDialog");
const bookInfoDialog = document.getElementById('bookInfoDialog')
const bookInfo = bookInfoDialog.querySelector('#expandedInfo')
const cancelBtn = newBookDialog.querySelector('#cancelBtn');
const confirmBtn = newBookDialog.querySelector("#confirmBtn");
const closeBtn = bookInfoDialog.querySelector('#closeBtn');


showButton.addEventListener("click", () => {
    newBookDialog.showModal();
});

confirmBtn.addEventListener("click", (event) => {
    event.preventDefault();
    newBookDialog.close();
    addNewBook();
    document.getElementById("myform").reset();
  });
  
cancelBtn.addEventListener("click", () => {
    newBookDialog.close();
  });

closeBtn.addEventListener("click", () => {
    bookInfoDialog.close();
  });


//Functions 
function populateShelf(){
    //Sort books alphabetically
    sortAlphabetically(myLibrary);
    //make new display
    myLibrary.forEach((bookObject)=>{
        shelf.appendChild(createBookDiv(bookObject))
    });
    reIndexBooks();//needed to give initial books their data-index attribute
};


function putBookOnShelf(newBook){
    //Sort books alphabetically
    sortAlphabetically(myLibrary);
    //Find index num of new book
    let bookIndex= myLibrary.findIndex(bookObject=>bookObject.title === newBook.title);
    //Make bookDiv for newBook
    let nextBook = createBookDiv(newBook);
    //Put on shelf according to indexNum
    let referenceBook = document.querySelector(`[data-index= '${bookIndex}']`);
    shelf.insertBefore(nextBook, referenceBook);
    //Re-Index bookDivs
    reIndexBooks();

}

function addNewBook(){
    const newTitle = document.getElementById('book-title').value
    const newAuthor = document.getElementById('book-author').value
    const newNumPages = document.getElementById('book-numPages').value
    const newStatus = document.getElementById('book-status').value
    const newBookObject = new Book(newTitle, newAuthor, newNumPages, newStatus);
    if (isBookInLibrary(newBookObject) === true){
        alert('Book is already in library');
        return;
    }else {
        myLibrary.push(newBookObject);
        putBookOnShelf(newBookObject);
    };
};

function createBookDiv(bookObject){
    //Create Div
    let nextBook = document.createElement('div');
    nextBook.classList.add('book');
    nextBook.style.backgroundColor = pickRandomColor();
    //Create title
    let bookTitle = document.createElement('p');
    bookTitle.classList.add('book-title');
    bookTitle.textContent = bookObject.title;
    //Create delete button
    let deleteButton = document.createElement('img');
    deleteButton.classList.add('delete');
    deleteButton.classList.add('book-icon');
    deleteButton.src='images/icons8-delete-48.png';
    deleteButton.alt='delete';
    //Create status button
    let statusButton = document.createElement('img');
    statusButton.classList.add('toggleStatus');
    statusButton.classList.add('book-icon');
    statusButton.src= getBookStatus(bookObject);
    statusButton.alt='status';
    //Add book info button
    let bookInfoBtn = document.createElement('img');
    bookInfoBtn.classList.add('book-info');
    bookInfoBtn.classList.add('book-icon');
    bookInfoBtn.src='images/icons8-magnifying-glass-64.png';
    bookInfoBtn.alt='book info';
    // Create icon container
    let iconContainer = document.createElement('div');
    iconContainer.classList.add('icon-container');
    //Append children
    iconContainer.appendChild(bookInfoBtn);
    iconContainer.appendChild(deleteButton);
    iconContainer.appendChild(statusButton);
    nextBook.appendChild(bookTitle);
    nextBook.appendChild(iconContainer);
    //Event listeners
    deleteButton.addEventListener("click", (event) =>{
    deleteBook(event.target.parentElement.parentElement);
    });
    statusButton.addEventListener('click', (event)=>{
        event.target.src = toggleBookStatus(event.target.parentElement.parentElement);
        
    })
    bookInfoBtn.addEventListener('click',(event)=>{
        bookInfo.textContent =(myLibrary[event.target.parentElement.parentElement.getAttribute('data-index')].info());
        bookInfoDialog.showModal();
    })
     return nextBook
};




function isBookInLibrary(bookObject){
    for(let bookOwed of myLibrary){
        let matches = 0
        for (let prop in bookOwed){
            if(bookOwed[prop] === bookObject[prop]){
                 matches +=1
            }else{
                continue;
            };
        };
        if (matches >= 4){
            return true;
        }else{
           continue;
        };
    }; 
};

function deleteBook(bookDiv){
    //Delete from library
    myLibrary.splice(bookDiv.getAttribute('data-index'),1);
    // Delete from shelf
    let books = document.querySelectorAll('.book');
    books.forEach((book)=> {
        if (book.getAttribute('data-index') === bookDiv.getAttribute('data-index')){
            shelf.removeChild(book)
        };
    });
    //Re-index books
    reIndexBooks();
};

function reIndexBooks(){
    let books = document.querySelectorAll('.book')
    books.forEach((book)=>{
        book.setAttribute('data-index',getBookIndex(book));
    });
};

function getBookIndex(bookDiv){
     let bookIndex= myLibrary.findIndex(bookObject=>bookObject.title === bookDiv.firstChild.textContent);
     return bookIndex
};


function getBookStatus(bookObject){
    let currentStatus = bookObject.status;
    switch(currentStatus){
        case 'read':
            return 'images/icons8-checkmark-48.png';
        case 'yet to read':
            return 'images/icons8-new-50.png';
        case 'reading':
            return 'images/icons8-open-book-50.png';
    };
};

function toggleBookStatus(bookDiv){
    //Get data-index
    let bookIndex= bookDiv.getAttribute('data-index');
    //use data-index to find bookObject in myLibrary
    let currentBookStatus = myLibrary[bookIndex].status;
    //change value of bookObject[status]
    switch (currentBookStatus){
        case 'read':
            myLibrary[bookIndex].status = 'yet to read';
            return 'images/icons8-new-50.png';
        case 'yet to read':
            myLibrary[bookIndex].status = 'reading';
            return 'images/icons8-open-book-50.png';
        case 'reading':
            myLibrary[bookIndex].status = 'read';
            return 'images/icons8-checkmark-48.png';
    };
};


function justParentText(bookDiv){
    let parentText = [].reduce.call(bookDiv.childNodes, function(a, b) { return a + (b.nodeType === 3 ? b.textContent : ''); }, '');
    return parentText;
}; //Source: https://medium.com/@roxeteer/javascript-one-liner-to-get-elements-text-content-without-its-child-nodes-8e59269d1e71

function sortAlphabetically(list){
    list.sort((a, b) => {
        const titleA = a.title.toUpperCase(); 
        const titleB = b.title.toUpperCase(); 
        if (titleA < titleB) {
          return -1;
        }
        if (titleA > titleB) {
          return 1;
        }
        return 0;
      });
};

function pickRandomColor(){
    const colorList = ['magenta','rebeccapurple','dodgerblue','green'];
    let colorIndex = Math.floor(Math.random()*4)
    return colorList[colorIndex]
}


//Styling
