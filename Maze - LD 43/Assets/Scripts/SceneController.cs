using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SceneController : MonoBehaviour {

    public GameObject player1;
    public GameObject player2;
    public int numberOfPlayers;
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
    }
	
    
    void Update () {
        if (numberOfPlayers == 1)
        {
            player1.SetActive(true);
        }
        if (numberOfPlayers == 2)
        {
            player1.SetActive(true);
            player2.SetActive(true);
        }
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
    }

    void OnApplicationQuit()
    {
        PlayerPrefs.DeleteAll();
    }

    void generateTable()
    {

    }
}
       