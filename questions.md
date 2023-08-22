## Questions for instructors
- [ ] is there a more elegent way to import multiple
functions/classes into a test module?  
```
    module.exports = {
    CheckersPiece,
    KingPiece
    }

    const PlayingPiecesClasses = require('../CheckersPiece');  
    const KingPiece = PlayingPiecesClasses.KingPiece;
    const CheckersPiece = PlayingPiecesClasses.CheckersPiece;
```
- [ ]  how should I handle unexpected inputs by default
- [ ]  should a new piece be created every time a move happens, or should I move the same object that already exists?
- [ ]  