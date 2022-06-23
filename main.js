
/* $(document).ready(function () {
    $('#title').autocomplete({                     //targets input box from index.html. bracket because this is an object. autocomplete is built in jquery
        source: async function(request, response) {     //this is jquery language and is related to jquery links in index.html
            let data= await fetch(`http://localhost:8000/search?query=${request.term}`)  //here we are sending the search and triggering the server
                    .then(results => results.json())       //when we get results, turn them into json
                    .then(results => results.map(result => {   //we are mapping the results to a new object
                        return {
                            label: result.title,
                            value: result.title,
                            id: result._id
                        }
                    }))
                response(data)
                //console.log(response)
        },  //this ends source asyn function
        minLength: 2,    //maybe not necessary because already set on server side
        select: function(event, ui) {    //when they select, passes specific object id to database
            console.log(ui.item.id)
            fetch(`http://localhost:8000/get/${ui.item.id}`) //the second get on our server.js is looking for an id number
                .then(result => result.json())  
                .then(result => {       //here is where we write the results to specific areas of the DOM
                    $('#cast').empty()   //this is linked to list in index.html.  first empty it
                    result.cast.forEach(cast =>    //this is a loop through the array
                        {
                            $("#cast").append(`<li>${cast}</li>`)
                        })
                        $('img').attr('src',result.poster)
                })
        }
    })  //this ends the $('#title').autocomplete line
}) */

$(document).ready(function () {
    $('#title').autocomplete({
        source: async function(request,response) {
            let data= await fetch(`http://localhost:8000/search?query=${request.term}`)
                    .then(results => results.json())
                    .then(results => results.map(result => {
                        return {
                            label: result.title,
                            value: result.title,
                            id: result._id
                        }
                    }))
                response(data)
                //console.log(response)
        },
        minLength: 2,
        select: function(event, ui) {
            console.log(ui.item.id)
            fetch(`http://localhost:8000/get/${ui.item.id}`)
                .then(result => result.json())
                .then(result => {
                    $('#cast').empty()
                    result.cast.forEach(cast =>
                        {
                            $("#cast").append(`<li>${cast}</li>`)
                        })
                        $('img').attr('src',result.poster)
                })
        }
    })
})