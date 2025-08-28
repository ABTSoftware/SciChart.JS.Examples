using UnityEngine;
using System.Collections;
using System.IO.Ports;

public class Arduino_Read : MonoBehaviour

{
    SerialPort sp = new SerialPort("COM5", 115200);
    public static string QRS;

    void Start()
    {
        sp.Open();
        sp.ReadTimeout = 1;
    }

    void Update()
    {
        try
        {
            QRS = sp.ReadLine();
            print(sp.ReadLine());
        }
        catch (System.Exception)
        {
        }
    }
}