﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BlockController : MonoBehaviour {

    public bool isSolidBlock = true;
    public bool hasPlayer = false;
    public bool fall;
    public int[] blockPosion;

    // Use this for initialization
    void Start ()
    {
        blockPosion = new int[2];
        getBlockPosition();
	}
	
	// Update is called once per frame
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
        blockPosion[0] = lin;
        blockPosion[1] = col;
    }

    void checkPlayer()
    {
        if (!fall)
        {
            if (hasPlayer && !isSolidBlock)
            {
                fall = true;
                gameObject.GetComponent<Rigidbody>().isKinematic = false;
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

    IEnumerator timer(float seconds)
    {
        yield return new WaitForSeconds(seconds);
    }

}
