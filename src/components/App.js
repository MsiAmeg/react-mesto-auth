import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import PopupWithForm from './PopupWithForm.js';
import ImagePopup from './ImagePopup.js';
import { useState, useEffect } from 'react';
import api from '../utils/Api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { CardsContext } from '../contexts/CardsContext.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';

function App() {

  const [currentUser, setCurrentUser] = useState({ about: '', avatar: '', name: '', _id: '', cohort: '' });
  const [cards, setCards] = useState([]);

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ name: '', link: '' });

  useEffect(() => {

    const userPromise = api.getUserData();
    const cardPromise = api.getInitialCards();

    Promise.all([userPromise, cardPromise])
      .then(([userPromise, cardPromise]) => {

        setCurrentUser({
          about: userPromise.about,
          avatar: userPromise.avatar,
          name: userPromise.name,
          _id: userPromise._id,
          cohort: userPromise.cohort
        });
        setCards(cardPromise);
      })
      .catch((err) => {
        console.log(err);
      })
  }, []);

  const handleCardLike = (card) => {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.toggleLike(card._id, isLiked)
      .then((newCard) => {
        setCards((prevState) => prevState.map((prevCard) => prevCard._id === card._id ? newCard : prevCard));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleCardDelete = (card) => {
    api.deleteCard(card._id)
      .then((newCard) => {
        setCards((prevState) => prevState.filter((prevCard) => prevCard._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleUpdateUser = ({ name, about }) => {
    api.setUserData({ name, about })
      .then((updatedUser) => {
        setCurrentUser({
          ...currentUser,
          about: updatedUser.about,
          name: updatedUser.name
        });
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateAvatar = ({ avatar }) => {
    api.setUserAvatar({ avatar })
      .then((updatedAvatar) => {
        setCurrentUser({
          ...currentUser,
          avatar: updatedAvatar.avatar
        });
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddPlaceSubmit = ({ name, link }) => {
    api.setCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  }
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }
  const handleCardClick = (card) => {
    setSelectedCard(card);
  }
  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({ name: '', link: '' });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CardsContext.Provider value={cards}>
        <div className="container">
          <Header />
          <Main onCardDelete={handleCardDelete} onCardClick={handleCardClick} onCardLike={handleCardLike} onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} onEditAvatar={handleEditAvatarClick} />
          <Footer />

          <EditProfilePopup onUpdateUser={handleUpdateUser} isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} />

          <EditAvatarPopup onUpdateAvatar={handleUpdateAvatar} isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} />

          <AddPlacePopup onAddPlace={handleAddPlaceSubmit} isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} />

          <PopupWithForm name='delete-card' title='Вы уверены?' buttonText='Да' isOpen={false} />

          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        </div>
      </CardsContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
