using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour {

    public int speed;
    private bool canMove;

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}

    void checkMovement()
    {
        if (canMove)
        {
            if (Input.GetButtonDown("up"))
            {
                canMove = false;
                Vector3 target = new Vector3(transform.position.x, transform.position.y + 1);
                movePlayer(target);
            }
            if (Input.GetButtonDown("down"))
            {
                canMove = false;
                Vector3 target = new Vector3(transform.position.x, transform.position.y - 1);
                movePlayer(target);
            }
            if (Input.GetButtonDown("right"))
            {
                canMove = false;
                Vector3 target = new Vector3(transform.position.x + 1, transform.position.y);
                movePlayer(target);
            }
            if (Input.GetButtonDown("left"))
            {
                canMove = false;
                Vector3 target = new Vector3(transform.position.x - 1, transform.position.y);
                movePlayer(target);
            }
        }
    }

    void movePlayer(Vector3 target)
    {
        float step = speed * Time.deltaTime;
        transform.position = Vector3.MoveTowards(transform.position, target, step);
    }
}
