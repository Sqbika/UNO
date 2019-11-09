# UNO
A website for tracking UNO points

Just a simple website for tracking points for UNO party. Lightweight, local only.

I host this as `https://sqbika.win/uno/` too for easy online access.

# How to use

It's simple. Open up the `index.html` or a website where it's hosted

Fill the `name` textbox of the player's name and press enter / the `Add` button.

Once everyone's name has been added, press Setup.

Once the round ends, fill the boxes with appropriate points for players, then press Enter at last box / press `Add` button.

You can navigate between players with `-` and `+`. If you press `Enter`, it'll jump to the next box. IF you press it at the last box, it'll add the points if every box is filled. If not, it'll jump to the beginning.

# Major TODO:

* [ ] Pre-game frontend, with settings and better player setup. (Detailed version, the current stays as the "quick" version (url/UNO/quick)
* [ ] Save / Load feature
* [ ] `End game` button (No, not thanos snap button, that would be bad)
* [ ] Point correction

# Minor TODO:

* [ ] Indicator for round winner
* [ ] Round starter indicator
* [ ] Player Dropout function

# Implemented Features: 

* Scroll to bottom when new points added in the point_div
* Moving across point inputs with `-+`
* Point tracking system for each player
* Auto sorted player columns based on current points
* Numpad based navigation and point adding system
* Semi-dynamic point tracking system
