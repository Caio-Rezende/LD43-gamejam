# LD43-gamejam
Gamejam LD 43

Equipe: Caio Rezende, Gustavo Christino, Sammy Azar, Thiago Bastos, Thiago Pereira

This project has an html 2d simulator in ./public and the unity 3d game in ./Maze...

The html is also hosted in https://ld43-gamejam.firebaseapp.com

Unity
- Cenário (tiles)
	- [x] 9x9
	- [x] Matriz de buracos
	- [x] Firebase, conexão multi usuário em tempo real
	- [x] Tiles com buraco, aplicar física apenas quando peça de personagem está sobre ela
- Personagens (peça)
	- [x] Posicionar pixelart sobre um tablado
- HUD
	- [ ] Tempo (total e da rodada)
	- [x] Score
	- [ ] Nicks

- Arte (Pixelart) M/F
	- [x] Lhama
	- [x] Shaman
	- [x] Guerreiro
	- [ ] Camponês
	- [x] Cenário (4 modelos tile)

- Som/Música
	- [x] 3 tipos de som por personagem (total 12)
	- [x] Música de fundo (peruana, flauta). Pelo menos dois ritmos (calmo e frenético)
	- [x] Som de sucesso
	- [x] Som de atenção (quando é a vez do jogador)
	
- Mecânica
	- [x] Seta escolhe tile no maze
	- [x] Contador por turno
	- [x] Cada jogador por turno
	
- Regras
	- [ ] Jogador pode escolher andar ou esperar
	- [x] Andar ele pode ir em qualquer das 4 direções possíveis (quando não na borda do tabuleiro)
	- [x] Objetivo é chegar ao centro
	- [x] Deve haver pelo menos um caminho possível
	- [x] Cada vez que cair no buraco ele respawn em outro canto (4 pontos de respawn, 1 por jogador)

- [x] Interface dados firebase (database.json)

- [x] Simulador de caminhos com paths (index.html -> só baixar e abrir no chrome)
	- [x] gerador automático
