using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Altar : MonoBehaviour {

    public SceneController sceneController;

	// Use this for initialization
	void Start () {
        Time.timeScale = 1;
        transform.position = new Vector3(6.0f, 1.0f, 5.7f);
    }
	
	// Update is called once per frame
	void Update () {
		
	}

    void OnTriggerEnter(Collider col)
    {
        if(sceneController.score1 == 2 || sceneController.score2 == 2)
        {
            gameObject.GetComponent<Animator>().SetBool("isDead", true);
        }
        else
        {
            col.gameObject.GetComponent<PlayerController>().isDead = true;
        }
        victory(col.gameObject.name);
    }

    void victory(string name)
    {
        int playerNum = int.Parse(name.Substring(name.Length - 1));
        sceneController.score(playerNum);
    }
}
