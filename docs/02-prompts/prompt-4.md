# Prompt 4  

**Modelo:**  gpt-5-mini (OpenAI)  
**Método de Prompt:** Chain-of-thought prompting  

**Prompt exacto en texto:**  

``` bash
Razoná paso a paso y genera una guía para integrar OAuth (Google) para un proyecto llamado "Simulador de Planificación Financiera".
```

**Captura de pantalla del prompt solicitado:**  
![Captura del prompt](..\02-prompts\capturas\prompt-4\prompt.png)  

**Resultado esperado:**  
Una guía completa, paso a paso, que permita a un desarrollador integrar OAuth de Google en su proyecto web.  

**Resultado obtenido:**  
* Explicación del flujo de autenticación (Authorization Code Flow y ID token).  
* Instrucciones detalladas de configuración en Google Cloud Console.  

**Captura de pantalla del resultado obtenido:**  
![Captura del resultado](..\02-prompts\capturas\prompt-4\resultado.png)  

**Correcciones manuales realizadas:**
* Se ajustó el contenido para ser adaptado al proyecto.  

**Aplicación en el proyecto:**  
Archivo `frontend/login.html` - boton "iniciar sesión con Google".  
Archivo `backend/server.js`  - endpoints.  
Archivo `.env` - variables de entorno.  
