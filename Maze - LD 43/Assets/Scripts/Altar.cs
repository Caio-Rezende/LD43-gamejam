using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Altar : MonoBehaviour {

    public UnityEngine.UI.Text msg;
    public SceneController sceneController;

	// Use this for initialization
	void Start () {
        Time.timeScale = 1;
    }
	
	// Update is called once per frame
	void Update () {
		
	}

    void OnTriggerEnter(Collider col)
    {
        victory(col.gameObject.name);
    }

    void victory(string name)
    {
        msg.text = name + " Won!";
        Time.timeScale = 0;
        int playerNum = int.Parse(name.Substring(name.Length - 1));
        sceneController.score(playerNum);
        StartCoroutine(wait(3.0f));
    }

    IEnumerator wait(float seconds)
    {
        yield return new WaitForSecondsRealtime(seconds);
        SceneManager.LoadScene(0);
    }


}
