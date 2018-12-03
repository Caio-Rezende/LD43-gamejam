using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneController : MonoBehaviour {

    public GameObject player1;
    public GameObject player2;
    public Material Stone1;
    public Material Stone2;
    public Material Stone3;
    public Material Grass1;
    public Material Grass2;
    public Material Grass3;
    public UnityEngine.UI.Text msg;
    public UnityEngine.UI.Text msg2;
    public UnityEngine.UI.Text msg3;
    public BlockController blockOriginal;
    public int numberOfPlayers;
    public int tableSize;
    public int turn;
    public int score1;
    public int score2;
    public UnityEngine.UI.Image scoreWarrior0;
    public UnityEngine.UI.Image scoreWarrior1;
    public UnityEngine.UI.Image scoreWarrior2;
    public UnityEngine.UI.Image scoreShaman0;
    public UnityEngine.UI.Image scoreShaman1;
    public UnityEngine.UI.Image scoreShaman2;

    void Start () {
        turn = 1;

        if (PlayerPrefs.HasKey("player1Score"))
        {
            score1 = PlayerPrefs.GetInt("player1Score");
            changeScoreWarrior(score1);
        }
        else
        {
            score1 = 0;
        }
        if (PlayerPrefs.HasKey("player2Score"))
        {
            score2 = PlayerPrefs.GetInt("player2Score");
            changeScoreShaman(score2);
        }
        else
        {
            score2 = 0;
        }

        generateTable(tableSize);
        msg2.text = "Sacrifice the lhama to please your God !";
        StartCoroutine(wait(5));

    }
	
    
    void Update () {
        
    }

    public void changeTurn()
    {
        if (numberOfPlayers == 1)
        {
            turn = 1;
        }

        if (numberOfPlayers == 2)
        {
            switch (turn)
            {
                case 1:
                    turn = 2;
                    break;
                case 2:
                    turn = 1;
                    break;
            }
        }
        
    }

    public void score(int playerNum)
    {
        if(playerNum == 1)
        {
            score1++;
            changeScoreWarrior(score1);
            PlayerPrefs.SetInt("player1Score", score1);
        }
        else if(playerNum == 2)
        {
            score2++;
            changeScoreShaman(score2);
            PlayerPrefs.SetInt("player2Score", score2);
        }
        PlayerPrefs.Save();

        if(score1 > 2)
        {
            msg3.text = "The Warrior SACRIFICED the llama!";
            player1.GetComponent<PlayerController>().canMove = false;
            player2.GetComponent<PlayerController>().canMove = false;
            turn = 0;
            score1 = 0;
            score2 = 0;
            StartCoroutine(waitAndReload(6));
            PlayerPrefs.DeleteAll();
        }
        else if (score2 > 2)
        {
            msg3.text = "The Shaman SACRIFICED the llama!";
            player1.GetComponent<PlayerController>().canMove = false;
            player2.GetComponent<PlayerController>().canMove = false;
            turn = 0;
            score1 = 0;
            score2 = 0;
            StartCoroutine(waitAndReload(6));
            PlayerPrefs.DeleteAll();
        }
        else
        {
            msg.text = "THE LLAMA still alive! Maybe next time! You have more experience now...";
            msg3.text = "YOU WAS SACRIFICED BY LLAMA!";
            turn = 0;
            player1.GetComponent<PlayerController>().canMove = false;
            player2.GetComponent<PlayerController>().canMove = false;
            StartCoroutine(waitAndReload(8));
        }

    }

    void OnApplicationQuit()
    {
        PlayerPrefs.DeleteAll();
    }

    void generateTable(int size)
    {
        int num = Random.Range(0, 11);
        bool[][] maps = Maps.maps;
        bool[] map = maps[num];
        int cont = 0;
        int[] terrain = Maps.terrain;
        for (int i = 0; i < size; i++)
        {
            for (int j = 0; j < size; j++)
            {
                Vector3 newBlockTransform = new Vector3(i, 0.0f, j);
                BlockController newBlock = Instantiate<BlockController>(blockOriginal, newBlockTransform, blockOriginal.transform.rotation);
                int[] pos = new int[2];
                pos[0] = i;
                pos[1] = j;
                newBlock.blockPosition = pos;
                newBlock.gameObject.name = "Block" + j + i;
                newBlock.isSolidBlock = map[cont];

                switch (terrain[cont])
                {
                    case 1:
                        newBlock.GetComponent<Renderer>().material = Grass3;
                        break;
                    case 2:
                        newBlock.GetComponent<Renderer>().material = Stone3;
                        break;
                    case 3:
                        newBlock.GetComponent<Renderer>().material = Grass2;
                        break;
                    case 4:
                        newBlock.GetComponent<Renderer>().material = Stone2;
                        break;
                    case 5:
                        newBlock.GetComponent<Renderer>().material = Grass1;
                        break;
                    case 6:
                        newBlock.GetComponent<Renderer>().material = Stone1;
                        break;
                }

                cont++;
            }
        }
        player1.transform.position = new Vector3(0, 0.6f, 12.2f);
        player2.transform.position = new Vector3(12, 0.6f, 0.2f);
    }

    void changeScoreWarrior(int number)
    {
        switch (number)
        {
            case 0:
                scoreWarrior0.gameObject.SetActive(true);
                scoreWarrior1.gameObject.SetActive(false);
                scoreWarrior2.gameObject.SetActive(false);
                break;
            case 1:
                scoreWarrior0.gameObject.SetActive(false);
                scoreWarrior1.gameObject.SetActive(true);
                scoreWarrior2.gameObject.SetActive(false);
                break;
            case 2:
                scoreWarrior0.gameObject.SetActive(false);
                scoreWarrior1.gameObject.SetActive(false);
                scoreWarrior2.gameObject.SetActive(true);
                break;
        }
    }

    void changeScoreShaman(int number)
    {
        switch (number)
        {
            case 0:
                scoreShaman0.gameObject.SetActive(true);
                scoreShaman1.gameObject.SetActive(false);
                scoreShaman2.gameObject.SetActive(false);
                break;
            case 1:
                scoreShaman0.gameObject.SetActive(false);
                scoreShaman1.gameObject.SetActive(true);
                scoreShaman2.gameObject.SetActive(false);
                break;
            case 2:
                scoreShaman0.gameObject.SetActive(false);
                scoreShaman1.gameObject.SetActive(false);
                scoreShaman2.gameObject.SetActive(true);
                break;
        }
    }

    IEnumerator waitAndReload(float seconds)
    {
        yield return new WaitForSecondsRealtime(seconds);
        SceneManager.LoadScene("MainScene");
    }

    IEnumerator wait(float seconds)
    {
        yield return new WaitForSecondsRealtime(seconds);
        msg2.text = "";
    }

}
       