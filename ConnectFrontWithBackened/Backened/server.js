import express from "express"  // To import like this hume package.json me type "module" define karna padega.

// import karne ke basically 2 ways hain common and module

const app = express();

app.get('/api/jokes', (req, res) => {
    const jokes = [
        {
            id: 1,
            title: 'A joke',
            content: 'This is a joke'
        },
        {
            id: 2,
            title: 'Second joke',
            content: 'This is another joke'
        },
        {
            id: 3,
            title: 'Third joke',
            content: 'This is another joke'
        },
        {
            id: 4,
            title: 'fourth joke',
            content: 'This is another joke'
        },
        {
            id: 5,
            title: 'fifth joke',
            content: 'This is another joke'
        },
    ]
    res.send(jokes);
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})