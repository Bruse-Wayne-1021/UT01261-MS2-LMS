document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('addBookForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const BookName = document.getElementById('bookName').value;
        const Isbn = document.getElementById('isbn').value;
        const publisher = document.getElementById('publisher').value;
        const copies = document.getElementById('copies').value;
        const coverUrl = document.getElementById('coverUrl').value;
        const genre = document.getElementById('genre').value;

        const bookurl = "http://localhost:3000/book";

        const bookDetails = {
            BookName,
            Isbn,
            publisher,
            copies,
            coverUrl,
            genre,
            bookaddedDate: new Date().toLocaleDateString()
        }

        try {
            // Using post method to add books to server
            const response = await fetch(bookurl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookDetails)
            });
            // checking book loaded in server  if loaded succuss display books 
            if (response.ok) {
                alert("book added succesfuly")

                await displaybooks();
            } else {
                throw new Error("failed to add book");

            }

        } catch (error) {
            console.log(error)
            alert("error :" + error)
        }


    });
    await displaybooks();
    await dispalyamembers();
})
// display books in table
// fetch books from server using get method
let displaybooks = async () => {

    const bookurl = "http://localhost:3000/book";
    const BooktableBdy = document.querySelector('tbody');

    try {

        const booksdata = await fetch(bookurl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const books = await booksdata.json();

        BooktableBdy.innerHTML = "";
        books.forEach((book, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
             <td>${book.BookName}</td>
             <td>${book.Isbn}</td>
             <td>${book.publisher}</td>
             <td>${book.copies}</td>
             <td>${book.genre}</td>
             <td><img src="${book.coverUrl}" alt="Book cover" style="width:50px; height:75px;"></td>
             
             <td><button onclick="Deletebook(${index})">Delete</button></td>
             `

            BooktableBdy.appendChild(row);

        });

    } catch (error) {
        console.log(error)
        alert("Error  :" + error)
    }
};

// member registrtion
document.getElementById('addMemberForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const FirstName = document.getElementById('firstName').value;
    const LastName = document.getElementById('lastName').value;
    const Nic = document.getElementById('nic').value;
    const Password = document.getElementById('password').value;
    const ConfirmPAssword = document.getElementById('confirmPassword').value;


    if (Password !== ConfirmPAssword) {
        alert("password does not matching")
        return;
    }

    const membersdata = {
        FirstName,
        LastName,
        Nic,
        Password,
        joinDate: new Date().toLocaleDateString()
    }

    const memnersurl = "http://localhost:3000/member";


    try {
        const addmember = await fetch(memnersurl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(membersdata)
        })

        if (addmember.ok) {
            alert("member registed sucess")
            await dispalyamembers();
        }
        else {
            throw new Error("some error in member registation please try again later");

        }
    } catch (error) {
        alert("error " + error)
    }



});
// display members in table

let dispalyamembers = async () => {
    const memberurl = "http://localhost:3000/member";
    const MemTablebody = document.getElementById('membertablebody');

    try {

        const memberdata = await fetch(memberurl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const members = await memberdata.json();

        MemTablebody.innerHTML = ""
        members.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${member.FirstName}</td>
              <td>${member.LastName}</td>
              <td>${member.Nic}</td>
              <td>${member.joinDate}</td>
            `
            MemTablebody.appendChild(row);
        })

    } catch (error) {
        console.error(error)
    }

};
// Fetch and populate the selected book's details into the form for editing
// const EditBookDetails = async (index) => {
//     const bookApi = "http://localhost:3000/book";

//     try {
//         // Fetch book data from the server
//         const response = await fetch(bookApi);
//         const books = await response.json();
        
//         // Find the selected book using the index--
//         const selectedBook = books[index];
        
//         // If the book exists, populate the form fields with its details
//         if (selectedBook) {
//             document.getElementById('bookName').value = selectedBook.BookName;
//             document.getElementById('isbn').value = selectedBook.Isbn;
//             document.getElementById('publisher').value = selectedBook.publisher;
//             document.getElementById('copies').value = selectedBook.copies;
//             document.getElementById('coverUrl').value = selectedBook.coverUrl;
//             document.getElementById('genre').value = selectedBook.genre;
            
//             // Store the selected book's id for later use during the update
//             document.getElementById('bookId').value = selectedBook.id;
//         } else {
//             throw new Error("Book not found");
//         }
//     } catch (error) {
//         console.error("Error fetching book details:", error);
//         alert("Error fetching book details: " + error.message);
//     }
    
// };

// On form submit, handle both adding a new book and updating an existing one
document.getElementById('addBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const bookApi = "http://localhost:3000/book";
    
    // Capture the book details from the form
    const bookData = {
        BookName: document.getElementById('bookName').value,
        Isbn: document.getElementById('isbn').value,
        publisher: document.getElementById('publisher').value,
        copies: document.getElementById('copies').value,
        coverUrl: document.getElementById('coverUrl').value,
        genre: document.getElementById('genre').value
    };

    // Get the bookId from the hidden input field (if editing an existing book)
    const bookId = document.getElementById('bookId').value;

    try {
        if (bookId) {
            // Update existing book (PUT request)
            await fetch(`${bookApi}/${bookId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookData)
            });
            alert("Book updated successfully");
        } else {
            // Add a new book (POST request)
            await fetch(bookApi, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookData)
            });
            alert("Book added successfully");
        }

        // Reload the book display
        await displaybooks();
    } catch (error) {
        console.error("Error saving book:", error);
        alert("Error saving book: " + error.message);
    }
    
});




const Deletebook = async (index) => {
    const bookApi = "http://localhost:3000/book";

    try {
        // Fetch the current books to get the ID of the book to be deleted
        const response = await fetch(bookApi);
        const books = await response.json();
        
        // Get the ID of the book to delete using the index
        const bookToDelete = books[index];

        if (bookToDelete) {
            const deleteResponse = await fetch(`${bookApi}/${bookToDelete.id}`, {
                method: "DELETE"
            });

            if (deleteResponse.ok) {
                alert("Book deleted successfully");
                // Refresh the book display
                await displaybooks();
            } else {
                throw new Error("Failed to delete the book");
            }
        } else {
            alert("Book not found");
        }
    } catch (error) {
        console.error("Error deleting book:", error);
        alert("Error deleting book: " + error.message);
    }
};


row.innerHTML = `
    <td>${book.BookName}</td>
    <td>${book.Isbn}</td>
    <td>${book.publisher}</td>
    <td>${book.copies}</td>
    <td>${book.genre}</td>
    <td><img src="${book.coverUrl}" alt="Book cover" style="width:50px; height:75px;"></td>
    <td><button onclick="EditBookDetails(${index})">Edit</button></td>
    <td><button onclick="Deletebook(${index})">Delete</button></td>
`;


// popup

// Get the modal

let AddbookModel=()=>{
    var modal = document.getElementById('id01');

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
AddbookModel();







// add new Memebr

var modal = document.getElementById('id02');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


