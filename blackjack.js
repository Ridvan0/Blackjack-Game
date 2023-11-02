
        // Kart destesi ve oyun durumu için değişkenler
        const deck = [];
        const playerHand = [];
        const dealerHand = [];
        let isGameActive = false;
        let totalMoney = 1000; // Başlangıçta toplam para
        let betAmount = 0;

        // Bahis miktarını artırma fonksiyonu
        function increaseBet() {
            if (!isGameActive) {
                betAmount += 10;
                if (betAmount > totalMoney) {
                    betAmount = totalMoney;
                }
                updateUI();
            }
        }

        // Bahis miktarını azaltma fonksiyonu
        function decreaseBet() {
            if (!isGameActive) {
                betAmount -= 10;
                if (betAmount < 0) {
                    betAmount = 0;
                }
                updateUI();
            }
        }
        function stand() {
            if (isGameActive) {
                endGame(false);
            }
        }
        // Kart deste oluşturma fonksiyonu
        function createDeck() {
            const suits = ['Sinek', 'Kupa', 'Karo', 'Maça'];
            const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

            for (const suit of suits) {
                for (const value of values) {
                    deck.push({ suit, value });
                }
            }
        }

        // Kart dağıtma fonksiyonu
        function dealCard(hand) {
            const card = deck.pop();
            hand.push(card);
            return card;
        }

        // Blackjack oyununu başlatma fonksiyonu
        function startGame() {
            if (betAmount === 0) {
                alert("Lütfen bir bahis miktarı seçin.");
                return;
            }

            isGameActive = true;
            createDeck();
            shuffleDeck(deck);
            playerHand.length = 0;
            dealerHand.length = 0;
            document.getElementById('player-cards').innerHTML = '';
            document.getElementById('dealer-cards').innerHTML = '';
            document.getElementById('player-score').textContent = 'Skor: 0';
            document.getElementById('dealer-score').textContent = 'Skor: 0';

            dealCard(playerHand);
            dealCard(dealerHand);
            dealCard(playerHand);
            dealCard(dealerHand);

            updateUI();
        }

        // Kartları karıştırma fonksiyonu (deck shuffle)
        function shuffleDeck(deck) {
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }
        }

        // Kartları görüntüleme ve UI güncelleme fonksiyonu
        function updateUI() {
            // Oyuncu kartları
            const playerCardsContainer = document.getElementById('player-cards');
            playerCardsContainer.innerHTML = '';
            for (const card of playerHand) {
                const cardElement = document.createElement('div');
                cardElement.textContent = `${card.value} ${card.suit}`;
                playerCardsContainer.appendChild(cardElement);
            }
            document.getElementById('player-score').textContent = `Skor: ${calculateHandValue(playerHand)}`;

            // Dağıtıcı kartları
            const dealerCardsContainer = document.getElementById('dealer-cards');
            dealerCardsContainer.innerHTML = '';
            for (const card of dealerHand) {
                const cardElement = document.createElement('div');
                cardElement.textContent = `${card.value} ${card.suit}`;
                dealerCardsContainer.appendChild(cardElement);
            }
            document.getElementById('dealer-score').textContent = `Skor: ${calculateHandValue(dealerHand)}`;

            // Butonları güncelle
            const startButton = document.getElementById('start-button');
            const hitButton = document.getElementById('hit-button');
            const standButton = document.getElementById('stand-button');
            const increaseBetButton = document.getElementById('increase-bet');
            const decreaseBetButton = document.getElementById('decrease-bet');

            startButton.disabled = isGameActive;
            hitButton.disabled = !isGameActive;
            standButton.disabled = !isGameActive;
            increaseBetButton.disabled = isGameActive;
            decreaseBetButton.disabled = isGameActive;

            // Bahis ve para bilgilerini güncelle
            document.getElementById('money-info').textContent = `Toplam Kazanılan Para: ${totalMoney} TL`;
            document.getElementById('bet-info').textContent = `Bahis Miktarı: ${betAmount} TL`;
        }

        // Kart çekme fonksiyonu
        function hit() {
            if (isGameActive) {
                dealCard(playerHand);
                const playerValue = calculateHandValue(playerHand);
                if (playerValue > 21) {
                    endGame(true);
                } else if (playerHand.length === 5 && playerValue <= 21) {
                    endGame(false);
                }
                updateUI();
            }
        }
        function doubleDown() {
            if (isGameActive) {
                if (betAmount * 2 <= totalMoney) { // Bahisin iki katı toplam paradan fazla olmamalı
                    betAmount *= 2;
                    dealCard(playerHand);
                    endGame(false);
                } else {
                    alert("Çifte katlama için yeterli para yok!");
                }
            }
        }
        
        // Kartların değerini hesaplama fonksiyonu
        function calculateHandValue(hand) {
            let handValue = 0;
            let hasAce = false;

            for (const card of hand) {
                const value = card.value;
                if (value === 'A') {
                    hasAce = true;
                }
                if (value === 'A') {
                    handValue += 11;
                } else if (['K', 'Q', 'J'].includes(value)) {
                    handValue += 10;
                } else {
                    handValue += parseInt(value);
                }
            }

            if (hasAce && handValue > 21) {
                handValue -= 10; // Ace'yi 1 olarak saymak
            }

            return handValue;
        }

        // Oyunu bitirme fonksiyonu
        function endGame(isPlayerBust) {
            isGameActive = false;

            // Dağıtıcının kartlarını aç
            while (calculateHandValue(dealerHand) < 17) {
                dealCard(dealerHand);
            }

            updateUI();

            const playerValue = calculateHandValue(playerHand);
            const dealerValue = calculateHandValue(dealerHand);

            if (isPlayerBust) {
                // Oyuncu battı, dağıtıcı kazandı
                alert("Oyuncu battı. Dağıtıcı kazandı!");
                totalMoney -= betAmount;
            } else if (dealerValue > 21 || playerValue > dealerValue) {
                // Dağıtıcı battı veya oyuncu daha yüksek bir el değerine sahip, oyuncu kazandı
                alert("Oyuncu kazandı!");
                totalMoney += betAmount;
            } else if (dealerValue > playerValue) {
                // Dağıtıcı daha yüksek bir el değerine sahip, dağıtıcı kazandı
                alert("Dağıtıcı kazandı!");
                totalMoney -= betAmount;
            } else if (playerHand.length === 5 && playerValue <= 21) {
                // 5 kart kuralları, oyuncunun 5 kartla 21'e ulaştığını kontrol eder
                alert("Oyuncu, 5 kartla 21'e ulaştı ve kazandı!");
                totalMoney += betAmount * 2;
            } else if (playerValue === 21 && playerHand.length === 2 && dealerValue !== 21) {
                // Doğrudan 21 elde etme, dağıtıcının 21'i tutturmadığı bir durumu kontrol eder
                alert("Oyuncu, doğrudan 21 ile kazandı!");
                totalMoney += betAmount * 1.5;
            } else if (dealerValue === 21 && dealerHand.length === 2 && playerValue !== 21) {
                // Dağıtıcı doğrudan 21 elde etme, oyuncunun 21'i tutturmadığı bir durumu kontrol eder
                alert("Dağıtıcı, doğrudan 21 ile kazandı!");
                totalMoney -= betAmount;
            } else {
                // Berabere
                alert("Berabere!");
            }
            betAmount = 0;
            updateUI();
        }

        // Blackjack oyununu başlatma butonu için tıklama olayı
        document.getElementById('start-button').addEventListener('click', startGame);
        // Kart çekme butonu için tıklama olayı
        document.getElementById('hit-button').addEventListener('click', hit);
        // Paso butonu için tıklama olayı
        document.getElementById('stand-button').addEventListener('click', stand);
        // Bahis artırma butonu için tıklama olayı
        document.getElementById('increase-bet').addEventListener('click', increaseBet);
        // Bahis azaltma butonu için tıklama olayı
        document.getElementById('decrease-bet').addEventListener('click', decreaseBet);
        document.getElementById('double-button').addEventListener('click', doubleDown);

        updateUI();