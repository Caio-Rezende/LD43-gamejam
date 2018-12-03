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
    public BlockController blockOriginal;
    public int numberOfPlayers;
    public int tableSize;
    public int turn;
    public static int score1;
    public static int score2;
    public UnityEngine.UI.Text scoreTxt1;
    public UnityEngine.UI.Text scoreTxt2;

    void Start () {
        turn = 1;

        if (PlayerPrefs.HasKey("player1Score"))
        {
            score1 = PlayerPrefs.GetInt("player1Score");
            scoreTxt1.text = score1.ToString();
        }
        else
        {
            score1 = 0;
        }
        if (PlayerPrefs.HasKey("player2Score"))
        {
            score2 = PlayerPrefs.GetInt("player2Score");
            scoreTxt2.text = score2.ToString();
        }
        else
        {
            score2 = 0;
        }

        generateTable(tableSize);
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
            scoreTxt1.text = score1.ToString();
            PlayerPrefs.SetInt("player1Score", score1);
        }
        else if(playerNum == 2)
        {
            score2++;
            scoreTxt2.text = score2.ToString();
            PlayerPrefs.SetInt("player2Score", score2);
        }
        PlayerPrefs.Save();

        if(score1 > 2)
        {
            msg.text = "Player 1 SACRIFICED the Lhama!";
            Time.timeScale = 0;
            score1 = 0;
            score2 = 0;
            StartCoroutine(wait(3));
        }
        else if (score2 > 2)
        {
            msg.text = "Player 2 SACRIFICED the Lhama!";
            Time.timeScale = 0;
            score1 = 0;
            score2 = 0;
            StartCoroutine(wait(3));
        }
        else
        {
            msg.text = "THE LHAMA still alive! Maybe next time! You have more experience now...";
            Time.timeScale = 0;
            StartCoroutine(wait(3));
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
        int midPos = (size - 1) / 2;
        player1.transform.position = new Vector3(0.0f, 0.6f, size-1);
        player2.transform.position = new Vector3(size - 1, 0.6f, 0.0f);
    }

    IEnumerator wait(float seconds)
    {
        yield return new WaitForSecondsRealtime(seconds);
        SceneManager.LoadScene(0);
    }

}
       