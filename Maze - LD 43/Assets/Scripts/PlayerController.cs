using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour {

    public int speed;
    private bool canMove;
    private bool moving;
    private Vector3 target;
    private GameObject block;

	// Use this for initialization
	void Start () {
        canMove = true;
        moving = false;
	}
	
	// Update is called once per frame
	void Update () {
        checkMovement();
        movePlayer();
        respawnPlayer();

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
                //gameObject.GetComponent<Rigidbody>().isKinematic = true;
                gameObject.GetComponent<Rigidbody>().useGravity = false;
                return;
            }
            if (Input.GetButtonDown("down"))
            {
                canMove = false;
                moving = true;
                target = new Vector3(transform.position.x, transform.position.y, transform.position.z - 1);
                //gameObject.GetComponent<Rigidbody>().isKinematic = true;
                gameObject.GetComponent<Rigidbody>().useGravity = false;
                return;
            }
            if (Input.GetButtonDown("right"))
            {
                canMove = false;
                moving = true;
                target = new Vector3(transform.position.x + 1, transform.position.y, transform.position.z);
                //gameObject.GetComponent<Rigidbody>().isKinematic = true;
                gameObject.GetComponent<Rigidbody>().useGravity = false;
                return;
            }
            if (Input.GetButtonDown("left"))
            {
                canMove = false;
                moving = true;
                target = new Vector3(transform.position.x - 1, transform.position.y, transform.position.z);
                //gameObject.GetComponent<Rigidbody>().isKinematic = true;
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
                canMove = true;
                //gameObject.GetComponent<Rigidbody>().isKinematic = false;
                gameObject.GetComponent<Rigidbody>().useGravity = true;
                block.GetComponent<BlockController>().hasPlayer = true;
            }
        }
    }

    void respawnPlayer()
    {
        if (gameObject.GetComponent<Transform>().position.y < -10)
        {
            string respawnBlockName = "";
            int num = Random.Range(1, 5);
            switch (num)
            {
                case 1:
                    respawnBlockName = "Block" + 04;
                    Debug.Log("aaaaaa");
                    break;
                case 2:
                    respawnBlockName = "Block" + 84;
                    break;
                case 3:
                    respawnBlockName = "Block" + 48;
                    break;
                case 4:
                    respawnBlockName = "Block" + 40;
                    break;
            }

            Vector3 blockPos = GameObject.Find(respawnBlockName).transform.position;
            transform.position = new Vector3(blockPos.x, 0.16f, blockPos.z);
        }
    }

    void OnCollisionEnter(Collision col)
    {
        block = col.gameObject;
    }
}
