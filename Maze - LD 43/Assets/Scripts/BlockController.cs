using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BlockController : MonoBehaviour {

    public bool isSolidBlock = true;
    public bool hasPlayer = false;
    public bool fall;
    public int[] blockPosition;
    public AudioClip blockAudio;
    
    private AudioSource audioSource;

    void Start ()
    {
        blockPosition = new int[2];
        audioSource = gameObject.GetComponent<AudioSource>();
        audioSource.clip = blockAudio;
	}
	
	void Update ()
    {
        checkPlayer();
        checkPositionToDestroy();
    }

    void getBlockPosition()
    {
        string nome = gameObject.name;
        int lin = int.Parse(nome.Substring(nome.Length - 2, 1));
        int col = int.Parse(nome.Substring(nome.Length - 1));
        blockPosition[0] = lin;
        blockPosition[1] = col;
    }

    void checkPlayer()
    {
        if (!fall)
        {
            if (hasPlayer && !isSolidBlock)
            {
                fall = true;
                gameObject.GetComponent<Rigidbody>().isKinematic = false;
                audioSource.Play();
            }
        }
    }

    void checkPositionToDestroy()
    {
        if (fall)
        {
            if (gameObject.GetComponent<Transform>().position.y < -10)
            {
                Destroy(gameObject);
            }
        }
    }

    void OnCollisionEnter(Collision col)
    {
        if (col.gameObject.name.Equals("Player1") || col.gameObject.name.Equals("Player2"))
        {
            hasPlayer = true;
        }
    }

    void OnCollisionExit(Collision col)
    {
        if (col.gameObject.name.Equals("Player1") || col.gameObject.name.Equals("Player2"))
        {
            hasPlayer = false;
        }
    }

}
