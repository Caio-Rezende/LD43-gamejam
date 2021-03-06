﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour {

    public int speed;
    public SceneController sceneController;
    public AudioClip movementAudio;

    public bool canMove;
    private bool moving;
    private Vector3 target;
    private BlockController block;
    private int turn;
    private string player;
    private Quaternion playerQuartenion;
    private int respawn;
    private AudioSource audioSource;
    public bool isDead;
    private bool stop;
    
	void Start () {

        player = gameObject.name;
        if (player.Equals("Player1"))
        {
            canMove = true;
        }
        else
        {
            canMove = false;
        }

        moving = false;
        turn = 1;
        playerQuartenion = transform.rotation;
        gameObject.GetComponent<Rigidbody>().freezeRotation = true;
        respawn = 0;
        audioSource = gameObject.GetComponent<AudioSource>();
        audioSource.clip = movementAudio;
        isDead = false;
        stop = false;
    }
	
	void Update () {
        checkTurn();
        checkMovement();
        movePlayer();
        respawnPlayer();
        checkIsDead();
    }

    void checkIsDead()
    {
        if (isDead)
        {
            gameObject.GetComponent<Animator>().SetBool("isDead", true);
        }
    }

    void checkTurn()
    {
        if (!moving && transform.position.y > 0)
        {
            turn = sceneController.turn;
            if (player.Equals("Player1") && turn == 1)
            {
                canMove = true;
            }
            else if (player.Equals("Player2") && turn == 2)
            {
                canMove = true;
            }
            else
            {
                canMove = false;
            }
        }
        
    }
    
    void checkMovement()
    {
        if (canMove)
        {
            if ((Input.GetButtonDown("up2") && player.Equals("Player1")) || (Input.GetButtonDown("up") && player.Equals("Player2")))
            {
                canMove = false;
                moving = true;
                target = new Vector3(transform.position.x, transform.position.y, transform.position.z + 1);
                gameObject.GetComponent<Rigidbody>().useGravity = false;
                audioSource.Play();
                return;
            }
            if ((Input.GetButtonDown("down2") && player.Equals("Player1")) || (Input.GetButtonDown("down") && player.Equals("Player2")))
            {
                canMove = false;
                moving = true;
                target = new Vector3(transform.position.x, transform.position.y, transform.position.z - 1);
                gameObject.GetComponent<Rigidbody>().useGravity = false;
                audioSource.Play();
                return;
            }
            if ((Input.GetButtonDown("right2") && player.Equals("Player1")) || (Input.GetButtonDown("right") && player.Equals("Player2")))
            {
                canMove = false;
                moving = true;
                target = new Vector3(transform.position.x + 1, transform.position.y, transform.position.z);
                gameObject.GetComponent<Rigidbody>().useGravity = false;
                audioSource.Play();
                return;
            }
            if ((Input.GetButtonDown("left2") && player.Equals("Player1")) || (Input.GetButtonDown("left") && player.Equals("Player2")))
            {
                canMove = false;
                moving = true;
                target = new Vector3(transform.position.x - 1, transform.position.y, transform.position.z);
                gameObject.GetComponent<Rigidbody>().useGravity = false;
                audioSource.Play();
                return;
            } 
        }
    }

    void movePlayer()
    {
        if (moving && !stop)
        {
            float step = speed * Time.deltaTime;
            transform.position = Vector3.MoveTowards(transform.position, target, step);
            if (transform.position.Equals(target))
            {
                moving = false; 
                gameObject.GetComponent<Rigidbody>().useGravity = true;
                gameObject.transform.rotation = playerQuartenion;
                sceneController.changeTurn();
            }
        }
    }

    void respawnPlayer()
    {
        if (gameObject.GetComponent<Transform>().position.y < -5 || respawn == 1)
        {
            respawn = 0;
            Label:
            string respawnBlockName = "";
            int num = Random.Range(1, 5);
            switch (num)
            {
                case 1:
                    if (GameObject.Find("Block120").GetComponent<BlockController>().hasPlayer)
                    {
                        goto Label;
                    }
                    respawnBlockName = "Block120";
                    break;
                case 2:
                    if (GameObject.Find("Block1212").GetComponent<BlockController>().hasPlayer)
                    {
                        goto Label;
                    }
                    respawnBlockName = "Block1212";
                    break;
                case 3:
                    if (GameObject.Find("Block00").GetComponent<BlockController>().hasPlayer)
                    {
                        goto Label;
                    }
                    respawnBlockName = "Block00";
                    break;
                case 4:
                    if (GameObject.Find("Block012").GetComponent<BlockController>().hasPlayer)
                    {
                        goto Label;
                    }
                    respawnBlockName = "Block012";
                    break;
            }

            Vector3 blockPos = GameObject.Find(respawnBlockName).transform.position;
            transform.position = new Vector3(blockPos.x, 0.7f, blockPos.z + 0.2f);
            gameObject.transform.rotation = playerQuartenion;
        }
    }

    void OnCollisionEnter(Collision col)
    {
        if (col.gameObject.name.Equals("Player1") || col.gameObject.name.Equals("Player2"))
        {
            if(gameObject.name.Equals("Player1") && turn == 2)
            {
                respawn = 1;
                col.gameObject.GetComponent<PlayerController>().respawnPlayer();
            }
            if (gameObject.name.Equals("Player2") && turn == 1)
            {
                respawn = 1;
                col.gameObject.GetComponent<PlayerController>().respawnPlayer();
            }
        }
    }

    void OnTriggerEnter(Collider col)
    {
        if (col.gameObject.name.Equals("Llama"))
        {
            stop = true;
        }
    }
}
