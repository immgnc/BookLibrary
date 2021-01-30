var data = [];
$(document).ready(function() {
    let categories = [];
    let authors = [];

    $.ajax({
        url: 'https://www.googleapis.com/books/v1/volumes?q=search+terms&maxResults=40',
        success: function(e) {
            data = e.items
            parseData(data)
            console.log(data)
            setImg(data);

        },
        error: function(e) {
            console.log('error', e)
        }
    })

    function setImg(data) {
        for (let i = 0; i < data.length; i++) {
            $('.multiple-items').append(`<div class ='pic-name'><img src='${data[i].volumeInfo.imageLinks.thumbnail}'><h3>${data[i].volumeInfo.title}<h3><h6>${data[i].volumeInfo.authors}</h6></div>`)
        }
        $('.multiple-items').slick({
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 4
        });
    }

    function parseData(data) {
        getUnique(data)
    }

    function getUnique(data, x) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].volumeInfo.categories) {
                for (let j = 0; j < data[i].volumeInfo.categories.length; j++) {
                    if (!check(data[i].volumeInfo.categories[j], categories)) {
                        categories.push(data[i].volumeInfo.categories[j])
                    }
                }
            }

            if (data[i].volumeInfo.authors) {
                for (let j = 0; j < data[i].volumeInfo.authors.length; j++) {
                    if (!check(data[i].volumeInfo.authors[j], authors)) {
                        authors.push(data[i].volumeInfo.authors[j])
                    }
                }
            }
        }

        categories = categories.sort()
        authors = authors.sort()

        setCategories(categories)
        setauthors(authors)
        setMainCategory(categories)
        const sortedByPageCount = data.sort(function(a, b) {
            return b.volumeInfo.pageCount - a.volumeInfo.pageCount
        })
    }

    function check(category, arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === category) {
                return true
            }
        }
        return false
    }

    function setCategories(categories) {
        for (let i = 0; i < categories.length; i++) {
            $('.form-group select.category').append(`<option val="${categories[i]}">${categories[i]}</option>`)
        }
    }

    function setauthors(authors) {
        for (let i = 0; i < authors.length; i++) {
            $('.form-group select.author').append(`<option val="${authors[i]}">${authors[i]}</option>`)
        }
    }

    function setMainCategory(categories) {
        for (let i = 0; i < categories.length; i++) {
            $('.main-nav-ul').append(`<li class="main-nav-li"><a id="${categories[i]}" onclick="handleClick()" href="#ulForCategory" >${categories[i]}</a></li> `)
        }
    }

    function filterByCategory(category) {
        const filteredArray = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].volumeInfo.categories) {
                for (let j = 0; j < data[i].volumeInfo.categories.length; j++) {
                    if (category === data[i].volumeInfo.categories[j]) {
                        filteredArray.push(data[i])
                    }
                }
            }
        }
    }
    $('.form-group select.category').change(function() {
        filterByCategory($(this).val())
    })
})

function handleClick() {
    categ = event.target.id
    addCategory(data, categ);
}

function addCategory(data, categ) {
    for (let i = 0; i < data.length; i++) {
        $(".main-contentDiv").remove()
    }

    for (let i = 0; i < data.length; i++) {
        let aut = '';
        if (data[i].volumeInfo.categories) {
            for (let j = 0; j < data[i].volumeInfo.categories.length; j++) {
                if (data[i].volumeInfo.categories[j] === categ) {
                    aut = data[i].volumeInfo.authors

                    $('.main-content').append(`
            <div class="main-contentDiv">
            <div class ="main-contentDivForImg"><img src="${data[i].volumeInfo.imageLinks.thumbnail}" alt =""/></div>
            <div class = "main-contentDivForText" >
                <h2 class = 'main-content-Div-ForText-H2' >${data[i].volumeInfo.title}</h2>
                <h6 class = 'main-content-Div-ForText-H6' >${aut}</h6> 
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt exercitationem, magni numquam consequuntur similique fugiat, aut doloribus laudantium natus voluptatem voluptatibus assumenda nulla libero voluptates dolor distinctio architecto reiciendis perspiciatis?</p>
                <div class="linkForBook"><a href=${data[i].volumeInfo.previewLink} target="_blank">Read More</a></div>
                <div>
                    <span><i class="fa fa-plus-circle"></i> Add To Wishlist<span>
                    <span class="ForWish"> <i class="fa fa-plus-circle"></i> Add To Card<span>
                    <span class="ForWish">PageCount: ${data[i].volumeInfo.pageCount} <span>
                    <span class="ForWish">Price: 10$ <span>
                </div>
            </div>
            </div>`)
                }
            }
        }
    }
}

search = () => {
    let filtrCategor = '';
    let filtrAuthor = '';
    let filterorderBy = '';

    filtrCategor = $('#selectCategory').val();
    filtrAuthor = $('#selectauthor').val();
    filterorderBy = $('#selectOrder').val();

    console.log(filtrCategor, filtrAuthor, filterorderBy)

    addCategory1(data, filtrCategor, filtrAuthor, filterorderBy)
}

function addCategory1(data, filtrCategor, filtrAuthor, filterorderBy) {

    var arr = [];

    for (let i = 0; i < data.length; i++) {
        $(".main-contentDiv").remove()
    }

    for (let i = 0; i < data.length; i++) {
        let aut = '';

        if (data[i].volumeInfo.categories) {
            for (let j = 0; j < data[i].volumeInfo.categories.length; j++) {
                if (data[i].volumeInfo.categories[j] === filtrCategor || filtrCategor === "all") {
                    if (data[i].volumeInfo.authors) {
                        for (let k = 0; k < data[i].volumeInfo.authors.length; k++) {

                            if (data[i].volumeInfo.authors[j] === filtrAuthor || filtrAuthor === "all") {

                                aut = data[i].volumeInfo.authors

                                let obj = {};
                                obj.name = data[i].volumeInfo.title;
                                obj.img = data[i].volumeInfo.imageLinks.thumbnail;
                                obj.author = aut;
                                obj.link = data[i].volumeInfo.previewLink;
                                obj.pgcount = data[i].volumeInfo.pageCount;
                                arr.push(obj)
                            }
                        }
                    } else { addCategory(data, filtrCategor) }
                }
            }
        }
    }
    if (filterorderBy === 'PageCount asc') {
        arr.sort(function(a, b) {
            return a.pgcount - b.pgcount;
        });
        console.log(arr)
    } else if (filterorderBy === 'PageCount desc') {
        arr.sort(function(a, b) {
            return b.pgcount - a.pgcount;
        });
        console.log(arr)
    } else if (filterorderBy === 'Name asc') {
        arr.sort(function(a, b) {
            var nameA = a.name.toUpperCase();
            var nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            return 0;
        });
        console.log(arr)
    } else if (filterorderBy === 'Name desc') {
        arr.sort(function(a, b) {
            var nameA = a.name.toUpperCase();
            var nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return 1;
            }
            if (nameA > nameB) {
                return -1;
            }

            return 0;
        });
        console.log(arr)
    } else if (filterorderBy === 'Author desc') {
        arr.sort(function(a, b) {
            var nameA = a.author[0].toUpperCase();
            var nameB = b.author[0].toUpperCase();
            if (nameA < nameB) {
                return 1;
            }
            if (nameA > nameB) {
                return -1;
            }

            return 0;
        });
        console.log(arr)
    } else if (filterorderBy === 'Author asc') {
        arr.sort(function(a, b) {
            var nameA = a.author[0].toUpperCase();
            var nameB = b.author[0].toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            return 0;
        });
        console.log(arr)
    }
    console.log(arr)

    function getUniqueListBy(arr, key) {
        return [...new Map(arr.map(item => [item[key], item])).values()]
    }

   arr = getUniqueListBy(arr, 'name')
    for (i = 0; i < arr.length; i++) {

        $('.main-content').append(`
    <div class="main-contentDiv">
    <div class ="main-contentDivForImg"><img src="${arr[i].img}" alt =""/></div>
    <div class = "main-contentDivForText" >
        <h2 class = 'main-content-Div-ForText-H2' >${arr[i].name}</h2>
        <h6 class = 'main-content-Div-ForText-H6' >${arr[i].author}</h6> 
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt exercitationem, magni numquam consequuntur similique fugiat, aut doloribus laudantium natus voluptatem voluptatibus assumenda nulla libero voluptates dolor distinctio architecto reiciendis perspiciatis?</p>
        <div class="linkForBook"><a href=${arr[i].link} target="_blank">Read More</a></div>
        <div>
            <span><i class="fa fa-plus-circle"></i> Add To Wishlist<span>
            <span class="ForWish"> <i class="fa fa-plus-circle"></i> Add To Card<span>
            <span class="ForWish">PageCount: ${arr[i].pgcount} <span>
            <span class="ForWish">Price: 10$ <span>

        </div>
    </div>
    </div>`)
    }
}