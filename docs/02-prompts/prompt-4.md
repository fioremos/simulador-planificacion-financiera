# Prompt 4

**Modelo:**  gpt-5-mini (OpenAI)  
**Metodo de Prompt:** Chain-of-thought prompting

**Prompt exacto en texto:**

``` bash
razona paso a paso y genera una guia para integrar OAuth (Google) para un proyecto llamado "Simulador de Planificación Financiera"
```

**Captura de pantalla del prompt solicitado:**  
![alt text](image-9.png)

**Resultado esperado:**  
Una guía completa, paso a paso, que permita a un desarrollador integrar OAuth de Google en su proyecto web.  

**Resultado obtenido:**  
* Explicación del flujo de autenticación (Authorization Code Flow y ID token).  
* Instrucciones detalladas de configuración en Google Cloud Console.  

**Captura de pantalla del resultado obtenido:**  
![alt text](image-8.png)

**Correcciones manuales realizadas:**
* Se ajusto el contenido para ser adaptado al proyecto.  

**Aplicacion en el proyecto:**  
Archivo `frontend/login.html` - boton "iniciar sesion con Google"  
Archivo `backend/server.js`  - endpoints  
Archivo `.env` - variables de entorno
