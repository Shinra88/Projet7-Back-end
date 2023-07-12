const { ObjectID } = require('bson');
const Book = require('../models/Book');
const fs = require('fs');
const { isValidObjectId } = require('mongoose');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        averageRating: bookObject.ratings[0].grade
    });
  
    book.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 };

 exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

 exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

  exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
  };
  
  exports.getAllBook = (req, res, next) => {
    Book.find()
   .then(books => res.status(200).json(books))
   .catch(error => res.status(404).json({ error }));
  };

exports.postBookRating = (req, res, next) => {

  const newRating = { ...req.body };
  // delete newRating.rating;

    Book.findOne({ _id: req.params.id })
  .then(book => {
    const savBook ={...book._doc};

    const newGrade = {
      userId: req.body.userId,
      grade: req.body.rating
    }

    savBook.ratings = [{ ...newGrade}, ...savBook.ratings];

    function calcAverageRating(arr) {
        let avr = Math.round((arr.reduce((acc, elem) => acc + elem.grade, 0) / arr.length) * 100) / 100;
        return avr;
      };
      savBook.averageRating = calcAverageRating(savBook.ratings);

      Book.updateOne(
        { _id: req.params.id },
        {...savBook}
        )
        .then(() => {
          res.status(200).json(savBook);
        })
        .catch((error) => {
          res.status(401).json({ error });
        });
    })
    .catch((error) => {
      console.log(error)
      res.status(400).json({ error });
    });
};

exports.getBestBooks = (req, res, next) => {
    Book.find()
      .then((books) => {
        res
          .status(200)
          // copie de mon tableau datas;
          // classement en décroissante avec sort
          //splice récupérer les 3 premiers livres.
          .json(
            [...books]
              .sort((a, b) => b.averageRating - a.averageRating)
              .splice(0, 3)
          );
      })
      .catch((error) => res.status(400).json({ error }));
  };