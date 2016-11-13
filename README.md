# Pass the Turing

The Turing Test with Movie Subtitle Data


## Getting Started

Like the namesake implies, the Alan Chatbot returns human-like responses when the user converses with it. We wanted to make a bot where the user wouldn't be sure if they were talking to a human or a computer when conversing with our bot. We created a database of movie scripts by using regular expressions on movie subtitles, which found the questions and answers for us. The user input is then checked if it fully matches a question, if it matches an answer (in case the user types a statement), and then if it partially matches a question if all else fails. Alan would love to speak to you at http://passtheturing.herokuapp.com/ or 415-200-2524 (made with Twilio!)


## Built With

* [Python](https://www.python.org/) - Extensive use of Python for Flask, Scraping, and more!
* [Flask](http://flask.pocoo.org/docs/0.11/) - The micro web framework we used
* [Pymongo](https://api.mongodb.com/python/current/) - NoSQL database
* [Twilio](https://www.twilio.com/) - Used Twilio SMS!

## Authors


* **Kenneth Rhee** - [kenrhe](https://www.github.com/kenrhe "Kenneth Rhee's Github")

* **Thomas Munduchira** - [thomasmunduchira](https://www.github.com/thomasmunduchira "Thomas Munduchira's Github")

* **Vincent Cheng** - [vrcheng](https://www.github.com/vrcheng "Vincent Cheng's Github")

* **Eliot Winchell** - [eliotwinchell](https://www.gitub.com/eliotwinchell "Eliot Winchell's Github")

* **Salman Bana** - [glaceon0](https://www.github.com/glaceon0 "Salman Bana's Github")


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
