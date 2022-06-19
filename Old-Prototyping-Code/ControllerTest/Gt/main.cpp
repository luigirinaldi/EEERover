#include <windows.h>
#include <GL/gl.h>
#include <GLFW/glfw3.h>
#include <iostream>
#include <cstdlib>

#define SCREEN_WIDTH 640
#define SCREEN_HEIGHT 480


int main()
{
   GLFWwindow *window; 

   // initialize 
   if (!glfwInit()) {
       return -1;
   }

   // create window and its opengl context 

   window = glfwCreateWindow(640, 480, "OpenGL Project Tutorial", NULL, NULL); 

   if (!window) {
       glfwTerminate(); 
       return -1; 
   }

   // make the window's context current 

   // loop untill the user closes the window 
   while (!glfwWindowShouldClose(window)) {
       glClear(GL_COLOR_BUFFER_BIT); 

       // render OpenGL here 

       int present = glfwJoystickPresent(GLFW_JOYSTICK_1); 
       std::cout << "Joystick/Gamepad status: " << present << std::endl; 

       int axesCount;
       const float *axes = glfwGetJoystickAxes(GLFW_JOYSTICK_1, &axesCount);


       if (1 == present) {
            
           //std::cout << "Number of axes available: " << axesCount << std::endl; 

           std::cout << "Axis 1: " << axes[0] << std::endl;
           std::cout << "Axis 2: " << axes[1] << std::endl; 
           std::cout << "Axis 3: " << axes[2] << std::endl;
           std::cout << "Axis 4: " << axes[3] << std::endl;

           std::cout << std::endl; 
           std::cout << std::endl;
           std::cout << std::endl;
       }


       // swap front and back buffers 
       glfwSwapBuffers(window);

       // poll for and process events 
       glfwPollEvents(); 

   }

   glfwTerminate(); 
   return 0; 
}