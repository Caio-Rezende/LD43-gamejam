using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour {

    public int speed;
    private bool canMove;
    private bool moving;
    private Vector3 target;
    private BlockController block;
    public SceneController sceneController;
    private int turn;
    private string player;
    private Quaternion playerQuartenion;
    private int respawn;
    
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
	}
	
	void Update () {
        checkTurn();
        checkMovement();
        movePlayer();
        respawnPlayer();
    }

    void checkTurn()
    {
        if (!moving && transform.position.y == 0.6f)
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
            if (Input.GetButtonDown("up"))
            {
                canMove = false;
                moving = true;
                target = new Vector3(transform.position.x, transform.position.y, transform.position.z + 1);
                gameObject.GetComponent<Rigidbody>().useGravity = false;
                return;
            }
            if (Input.GetButtonDown("down"))
            {
                canMove = false;
                moving = true;
                target = new Vector3(transform.position.x, transform.position.y, transform.position.z - 1);
                gameObject.GetComponent<Rigidbody>().useGravity = false;
                return;
            }
            if (Input.GetButtonDown("right"))
            {
                canMove = false;
                moving = true;
                target = new Vector3(transform.position.x + 1, transform.position.y, transform.position.z);
                gameObject.GetComponent<Rigidbody>().useGravity = false;
                return;
            }
            if (Input.GetButtonDown("left"))
            {
                canMove = false;
                moving = true;
                target = new Vector3(transform.position.x - 1, transform.position.y, transform.position.z);
                gameObject.GetComponent<Rigidbody>().useGravity = false;
                return;
            } 
        }
    }

    void movePlayer()
    {
        if (moving)
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
            transform.position = new Vector3(blockPos.x, 0.85f, blockPos.z);
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

   
}
