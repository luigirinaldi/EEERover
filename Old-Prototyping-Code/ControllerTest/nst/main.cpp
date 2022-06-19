#include <SFML/Graphics.hpp>
#include <iostream>

int main()
{
    sf::RenderWindow window(sf::VideoMode(200, 200), "SFML works!");
    sf::CircleShape shape(100.f);
    shape.setFillColor(sf::Color::Red);

    while (window.isOpen())
    {
        sf::Event event;
        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed){window.close();}
            else if (event.type==sf::Event::JoystickMoved) {std::cout<<"moved"<<std::endl;}
        }

        if(sf::Joystick::isConnected(0)){
            shape.setFillColor(sf::Color::Green);
            std::cout<<"connected"<<std::endl;
        }
        if(!sf::Joystick::isConnected(0)){
            shape.setFillColor(sf::Color::Red);
            std::cout<<"not connected"<<std::endl;
        }
        // std::cout<<sf::Joystick::ButtonCount<<std::endl;
        if(sf::Joystick::isButtonPressed(0,1)){
            std::cout<<"Button1Pressed"<<std::endl;
        }

        window.clear();
        window.draw(shape);
        window.display();
    }

    return 0;
}