import pygame
import json, os
import socket
import ipaddress
import sys
import time

#Some of the code credit to https://www.youtube.com/watch?v=hqBgJQOa_1E

# ################################# LOAD UP A BASIC WINDOW #################################
pygame.init()
# DISPLAY_W, DISPLAY_H = 960, 570
# canvas = pygame.Surface((DISPLAY_W,DISPLAY_H))
# window = pygame.display.set_mode(((DISPLAY_W,DISPLAY_H)))
# running = True
# player = pygame.Rect(DISPLAY_W/2, DISPLAY_H/2, 60,60)
# LEFT, RIGHT, UP, DOWN = False, False, False, False
# clock = pygame.time.Clock()
# color = 0
# ###########################################################################################

#Initialize controller
joysticks = []
for i in range(pygame.joystick.get_count()):
    joysticks.append(pygame.joystick.Joystick(i))
for joystick in joysticks:
    joystick.init()

with open(os.path.join("ps4_keys.json"), 'r+') as file:
    button_keys = json.load(file)
# 0: Left analog horizonal, 1: Left Analog Vertical, 2: Right Analog Horizontal
# 3: Right Analog Vertical 4: Left Trigger, 5: Right Trigger
analog_keys = {0:0, 1:0, 2:0, 3:0, 4:-1, 5: -1 }

TimerSend = pygame.USEREVENT + 1
TimerSendTime = 700
IsTimeToSend = True
HasStopped = False
Stopping = True
pygame.time.set_timer(TimerSend, TimerSendTime)

UDP_IP = "127.0.0.1"
UDP_PORT = 5005
message = "B000A000000000R" # B + Rotation (0 stop 1 clockwise 2 anti clockwise) + motion 1 (forward 1, back 2, stop 0) + motion 2 (right 3, left 4, stop 0) + A + motion 1 sped + motion 2 sped + rotating sped + R
message = list(message)
message[3] = '0'
print(message)
message = str(message)
print(message)
message =bytes(message, "ascii")
print(message)

print("UDP IP: ")
UDP_IP = input()

try:
    ip = ipaddress.ip_address(sys.argv[1])
    print('%s is a correct IP%s address.' % (ip, ip.version))
except ValueError:
    print('address/netmask is invalid: %s' % sys.argv[1])
except:
    print('Usage : %s  ip' % sys.argv[0])

print("UDP PORT: ")
UDP_PORT = int(input())

# START OF GAME LOOP
while 1:
    ################################# CHECK PLAYER INPUT #################################
    for event in pygame.event.get():
        message = "B000A000000000R"
        if event.type == TimerSend:
            IsTimeToSend = True
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            ############### UPDATE SPRITE IF SPACE IS PRESSED #################################
            pass

        # HANDLES BUTTON PRESSES
        if event.type == pygame.JOYBUTTONDOWN:
            #print(str(event.button) + "Down")
            if event.button == button_keys['left_arrow']:
                print("LeftKeyDown")
                message = b"B004A255R"
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        
                print(message)
                if(type(message) != bytes):
                    message = bytes(message, "ascii")
                sock.sendto(message, (UDP_IP, UDP_PORT))
                
            if event.button == button_keys['right_arrow']:
                print("RightKeyDown")
                message = b"B003A255R"
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        
                print(message)
                if(type(message) != bytes):
                    message = bytes(message, "ascii")
                sock.sendto(message, (UDP_IP, UDP_PORT))
                
            if event.button == button_keys['down_arrow']:
                print("DownKeyDown")
                message = b"B002A255R"
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        
                print(message)
                if(type(message) != bytes):
                    message = bytes(message, "ascii")
                sock.sendto(message, (UDP_IP, UDP_PORT))
                
            if event.button == button_keys['up_arrow']:
                print("UpKeyDown")
                message = b"J001A255B"
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        
                print(message)
                if(type(message) != bytes):
                    message = bytes(message, "ascii")
                sock.sendto(message, (UDP_IP, UDP_PORT))
                
            if event.button == button_keys['circle']:
                print("CircleKeyDown")
            if event.button == button_keys['square']:
                print("SquareKeyDown")
            if event.button == button_keys['triangle']:
                print("TriangleKeyDown")
            if event.button == button_keys['x']:
                print("XKeyDown")
            if event.button == button_keys['L1']:
                print("L1KeyDown")
                message = b"B006A255R"
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        
                print(message)
                if(type(message) != bytes):
                    message = bytes(message, "ascii")
                sock.sendto(message, (UDP_IP, UDP_PORT))
                
            if event.button == button_keys['R1']:
                print("R1KeyDown")
                message = b"B005A255R"
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        
                print(message)
                if(type(message) != bytes):
                    message = bytes(message, "ascii")
                sock.sendto(message, (UDP_IP, UDP_PORT))
                
        # HANDLES BUTTON RELEASES
        if event.type == pygame.JOYBUTTONUP:
            #print(str(event.button) + "Down")
            if event.button == button_keys['left_arrow']:
                print("LeftKeyUp")
                message = b"B000A000R"
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        
                print(message)
                if(type(message) != bytes):
                    message = bytes(message, "ascii")
                sock.sendto(message, (UDP_IP, UDP_PORT))
                
            if event.button == button_keys['right_arrow']:
                print("RightKeyUp")
                message = b"B000A000R"
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        
                print(message)
                if(type(message) != bytes):
                    message = bytes(message, "ascii")
                sock.sendto(message, (UDP_IP, UDP_PORT))
                
            if event.button == button_keys['down_arrow']:
                print("DownKeyUp")
                message = b"B000A000R"
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        
                print(message)
                if(type(message) != bytes):
                    message = bytes(message, "ascii")
                sock.sendto(message, (UDP_IP, UDP_PORT))
                
            if event.button == button_keys['up_arrow']:
                print("UpKeyUp")
                message = b"J000A000B"
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        
                print(message)
                if(type(message) != bytes):
                    message = bytes(message, "ascii")
                sock.sendto(message, (UDP_IP, UDP_PORT))
                
            if event.button == button_keys['circle']:
                print("CircleKeyUp")
            if event.button == button_keys['square']:
                print("SquareKeyUp")
            if event.button == button_keys['triangle']:
                print("TriangleKeyUp")
            if event.button == button_keys['x']:
                print("XKeyUp")
            if event.button == button_keys['L1']:
                print("L1KeyUp")
                message = b"B000A000R"
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        
                print(message)
                if(type(message) != bytes):
                    message = bytes(message, "ascii")
                sock.sendto(message, (UDP_IP, UDP_PORT))
                
            if event.button == button_keys['R1']:
                print("R1KeyUp")
                message = b"B000A000R"
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        
                print(message)
                if(type(message) != bytes):
                    message = bytes(message, "ascii")
                sock.sendto(message, (UDP_IP, UDP_PORT))
                

        #HANDLES ANALOG INPUTS
        if event.type == pygame.JOYAXISMOTION and abs(event.value) > 0.10 and event.axis != 5 and event.axis !=4:
            analog_keys[event.axis] = event.value
            # print(analog_keys)
            # Horizontal Analog
            print("Trigger")
            print(event.axis)
            axis0 = pygame.joystick.Joystick(0).get_axis(0)
            axis1 = pygame.joystick.Joystick(0).get_axis(1)
            axis2 = pygame.joystick.Joystick(0).get_axis(2)
            if(abs(axis0)>0.15):
                #print("0")
                #print(axis0)
                if(axis0>0):
                    if(int(axis0*255) <= 50 and int(axis1*255) <= 50 and int(axis2*255) <= 50):
                        message = "B000A000000000R"
                        IsTimeToSend = True
                        Stopping = True
                    else:
                        
                        message = list(message)
                        message[3] = '3'
                        a = list(str(int((axis0*255))+1000))
                        message[8] = a[1]
                        message[9] = a[2]
                        message[10] = a[3]
                        message = "".join(message)

                else:
                    if(int(abs(axis2)*255) <= 50 and int(abs(axis1)*255) <= 50 and int(abs(axis0)*255) <= 50):
                        message = "B000A000000000R"
                        IsTimeToSend = True
                        Stopping = True
                    else:

                        message = list(message)
                        a = list(str(int((abs(axis0)*255))+1000))
                        message[8] = a[1]
                        message[9] = a[2]
                        message[10] = a[3]
                        message[3] = '4'
                        message = "".join(message)
                    

                    
            if(abs(axis1)>0.15):
                #print("1")
                #print(axis1)
                if(axis1>0):
                    if(int(axis0*255) <= 50 and int(axis1*255) <= 50 and int(axis2*255) <= 50):
                        message = "B000A000000000R"
                        IsTimeToSend = True
                        Stopping = True
                    else:

                        message = list(message)
                        message[2] = '2'
                        a = list(str(int((axis1*255))+1000))
                        message[5] = a[1]
                        message[6] = a[2]
                        message[7] = a[3]
                        message = "".join(message)

                else:
                    if(int(abs(axis2)*255) <= 50 and int(abs(axis1)*255) <= 50 and int(abs(axis0)*255) <= 50):
                        message = "B000A000000000R"
                        IsTimeToSend = True
                        Stopping = True
                    else:

                        message = list(message)
                        message[2] = '1'
                        a = list(str(int((abs(axis1)*255))+1000))
                        message[5] = a[1]
                        message[6] = a[2]
                        message[7] = a[3]
                        message = "".join(message)


            if(abs(axis2)>0.15):
                #print("2")
                #print(axis2)
                if(axis2>0):
                    if(int(axis0*255) <= 50 and int(axis1*255) <= 50 and int(axis2*255) <= 50):
                        message = "B000A000000000R"
                        IsTimeToSend = True
                        Stopping = True
                    else:
                        message = list(message)
                        message[1] = '1'
                        a = list(str(int((axis2*255))+1000))
                        message[11] = a[1]
                        message[12] = a[2]
                        message[13] = a[3]
                        message = "".join(message)

                else:
                    if(int(abs(axis2)*255) <= 50 and int(abs(axis1)*255) <= 50 and int(abs(axis0)*255) <= 50):
                        message = "B000A000000000R"
                        IsTimeToSend = True
                        Stopping = True
                    else:
                        message = list(message)
                        message[1] = '2'
                        a = list(str(int((abs(axis2)*255))+1000))
                        message[11] = a[1]
                        message[12] = a[2]
                        message[13] = a[3]
                        message = "".join(message)

            if(Stopping):
                    if(IsTimeToSend and (not HasStopped)):
                        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                        
                        
                        print(message)
                        if(type(message) != bytes):
                            message = bytes(message, "ascii")
                        sock.sendto(message, (UDP_IP, UDP_PORT))
                        
                        IsTimeToSend = False

                        HasStopped = True
                    else:
                        IsTimeToSend = False
            else:
                    if(IsTimeToSend):
                        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                        
                        
                        print(message)
                        if(type(message) != bytes):
                            message = bytes(message, "ascii")
                        sock.sendto(message, (UDP_IP, UDP_PORT))
                        
                        IsTimeToSend = False

                        HasStopped = False
                    else:
                        IsTimeToSend = False
                        
            Stopping = False
        
            #print("3")
            #print(pygame.joystick.Joystick(0).get_axis(3))
            
        
        
        

        
            # if abs(analog_keys[0]) > .4:
            #     if analog_keys[0] < -.7:
            #         LEFT = True
            #     else:
            #         LEFT = False
            #     if analog_keys[0] > .7:
            #         RIGHT = True
            #     else:
            #         RIGHT = False
            # # Vertical Analog
            # if abs(analog_keys[1]) > .4:
            #     if analog_keys[1] < -.7:
            #         UP = True
            #     else:
            #         UP = False
            #     if analog_keys[1] > .7:
            #         DOWN = True
            #     else:
            #         DOWN = False
                # Triggers






    # Handle Player movement
    # if LEFT:
    #     player.x -=5 #*(-1 * analog_keys[0])
    # if RIGHT:
    #     player.x += 5 #* analog_keys[0]
    # if UP:
    #     player.y -= 5
    # if DOWN:
    #     player.y += 5

    # if color < 0:
    #     color = 0
    # elif color > 255:
    #     color = 255


    ################################# UPDATE WINDOW AND DISPLAY #################################
    # canvas.fill((255,255,255))
    # pygame.draw.rect(canvas, (0,0 + color,255), player)
    # window.blit(canvas, (0,0))
    # clock.tick(60)
    # pygame.display.update()
