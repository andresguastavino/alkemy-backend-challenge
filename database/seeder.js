const { Character, MovieOrSerie, Genre, CharacterMovieOrSerie, User } = require('./index');

const seedUsers = async () => {
    await User.bulkCreate(users);
}

const seedCharacters = async () => {
    await Character.bulkCreate(characters);
}

const seedGenres = async () => {
    await Genre.bulkCreate(genres);
}

const seedMovies = async () => {
    const genres = await Genre.findAll();

    let newMoviesOrSeries = moviesOrSeries;
    if(genres.length) {
        newMoviesOrSeries = newMoviesOrSeries.map(movie => {
            const i = Math.floor(Math.random() * genres.length);
            movie.genre_id = genres[i].id;
            return movie;
        });
    }

    await MovieOrSerie.bulkCreate(newMoviesOrSeries);
}

const seedCharactersWithMoviesOrSeries = async () => {
    const characters = await Character.findAll();
    const moviesOrSeries = await MovieOrSerie.findAll();

    if(!characters.length || !moviesOrSeries.length) new Error('No characters or movies_or_series to seed characters_movies_or_series');

    let counter = 0;
    const relations = [];
    const characterMovieOrSerie = [];
    while(counter < 10) {
        let i = Math.floor(Math.random() * characters.length);
        let j = Math.floor(Math.random() * moviesOrSeries.length);

        if(!relations.includes(`${i}${j}`)) {
            characterMovieOrSerie.push({
                character_id: characters[i].id,
                m_or_s_id: moviesOrSeries[j].id
            });
            counter++;
            relations.push(`${i}${j}`);
        }
    }
    
    await CharacterMovieOrSerie.bulkCreate(characterMovieOrSerie);
}   

module.exports = {
    seedCharacters,
    seedGenres,
    seedMovies,
    seedUsers,
    seedCharactersWithMoviesOrSeries
}

const users = [
    {
        email: 'asd@test.com',
        password: 'pasSword22'
    },
    {
        email: 'johndoe@gmail.com',
        password: 'richie_ABC_33'
    },
    {
        email: 'richard_simpson@hotmail.com',
        password: 'notAnEasyPassword99'
    },
];

const genres = [
    {
        name: 'Horror',
        image: 'https://www.filmsite.org/images/horror-genre.jpg'
    },
    {
        name: 'Drama',
        image: 'https://www.filmsite.org/images/drama-genre.jpg'
    },
    {
        name: 'Adventure',
        image: 'https://www.filmsite.org/images/adventure-genre.jpg'
    },
    {
        name: 'Romance',
        image: 'https://static.tvtropes.org/pmwiki/pub/images/romance_genre.jpg'
    },
    {
        name: 'Comedy',
        image: 'https://images.assetsdelivery.com/compings_v2/bsd555/bsd5552004/bsd555200401476.jpg'
    }
];

const characters = [
    {
        name: 'Paul',
        age: 23,
        weight: 54.5,
        history: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Premios_Goya_2020_-_Pablo_Albor%C3%A1n_%28cropped%29.jpg/1200px-Premios_Goya_2020_-_Pablo_Albor%C3%A1n_%28cropped%29.jpg'    
    },
    {
        name: 'Jorge',
        age: 54,
        weight: 80.02,
        history: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
        image: 'https://cnnespanol.cnn.com/wp-content/uploads/2022/08/guillermo-lasso-cancer.jpg?quality=100&strip=info'
    },
    {
        name: 'Claude',
        age: 35,
        weight: 62.4,
        history: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
        image: 'https://e00-telva.uecdn.es/assets/multimedia/imagenes/2021/09/08/16310926977209.jpg'
    },
    {
        name: 'Richard',
        age: 77,
        weight: 52.1,
        history: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
        image: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/3UYJQXF7F5AZ7PRXWLP3XQ5P6Q.jpg'
    },
    {
        name: 'John',
        age: 67,
        weight: 70.2,
        history: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
        image: 'https://fotos.perfil.com/2021/05/24/trim/1040/780/guillermo-moreno-1177298.jpg'
    },
    {
        name: 'Mary',
        age: 14,
        weight: 24.5,
        history: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
        image: 'https://fotos.perfil.com/2021/03/16/trim/950/534/claudia-villafane-1145653.jpg'
    }
];

const moviesOrSeries = [
    {
        title: '1917',
        createdDate: '2021-03-13',
        rating: 98,
        image: 'https://es.web.img3.acsta.net/pictures/20/01/09/15/10/0234685.jpg'
    },
    {
        title: 'Uncharted',
        createdDate: '2022-06-08',
        rating: 56,
        image: 'https://play-lh.googleusercontent.com/kRdqFSMEo9s33W6DVZKMpMOpFvVb-9DWQK9VLU0k9Di-pnoJdr8fqB4DycZmq4Z-ukat98QVO2kzl-k8Gs8=s256-rw'
    },
    {
        title: 'Sonic the Hedgehog',
        createdDate: '2019-05-22',
        rating: 100,
        image: 'https://i.ytimg.com/vi/bSFXNjG36As/movieposter_en.jpg'
    },
    {
        title: 'Morbius',
        createdDate: '2022-09-22',
        rating: 5,
        image: 'https://i.ytimg.com/vi/NhSG87FRpUU/movieposter_en.jpg'
    },
    {
        title: 'The Lost City',
        createdDate: '2021-01-05',
        rating: 69,
        image: 'https://wwwimage-us.pplusstatic.com/thumbnails/photos/w370-q80/movie_asset/77/00/10/lostc_salone_poster_1400x2100.jpg'
    }
];