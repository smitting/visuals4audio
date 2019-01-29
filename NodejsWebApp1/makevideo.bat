"c:\program files\ffmpeg\bin\ffmpeg" -loglevel panic -r 30 -y -i img\test%%03d.png -c:v libx264 -vf fps=25 -pix_fmt yuv420p out.mp4
