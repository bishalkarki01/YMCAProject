/** @format */

const express = require("express");
const router = express.Router();
const Program = require("../models/Program");
const RegisteredUser = require("../models/RegisteredUser");

//Registration of program
router.post("/programRegister", async (req, res) => {
  const {
    programName,
    startDate,
    endDate,
    time,
    memberPrice,
    nonMemberPrice,
    description,
    location,
    participants,
  } = req.body;

  // Create a new program instance
  const newProgram = new Program({
    programName,
    startDate,
    endDate,
    time,
    memberPrice,
    nonMemberPrice,
    description,
    location,
    participants,
  });

  try {
    // Save the program to the database
    await newProgram.save();
    res
      .status(201)
      .json({ success: true, message: "Program saved successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to save program." });
  }
});

//Get all the program
router.get("/", async (req, res) => {
  try {
    // Fetch all programs
    const programs = await Program.find();

    // Loop through each program and count active registrations
    const programsWithActiveRegistrations = await Promise.all(
      programs.map(async (program) => {
        const activeRegistrationsCount = await RegisteredUser.countDocuments({
          programId: program._id,
          activeStatus: true,
        });

        return {
          ...program._doc, // Spread original program document fields
          activeRegistrations: activeRegistrationsCount, // Add active registration count
        };
      })
    );

    // Return programs with active registration counts
    res.status(200).json(programsWithActiveRegistrations);
  } catch (error) {
    console.error("Error fetching programs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch programs.",
    });
  }
});

// Update a program by ID
router.put("/:id", async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ success: true, program });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update program." });
  }
});

// Delete a program by ID
router.delete("/:id", async (req, res) => {
  try {
    await Program.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Program deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete program." });
  }
});

//Register Program by user
router.post("/registeredProgram", async (req, res) => {
  const { userId, programId } = req.body;

  try {
    // Check if the user is already actively registered for the program
    const activeRegistration = await RegisteredUser.findOne({
      userId,
      programId,
      activeStatus: true,
    });

    if (activeRegistration) {
      return res.status(400).json({
        message: "You are already registered for this program.",
      });
    }

    // Check if the user has canceled the same program more than 3 times
    const cancellationCount = await RegisteredUser.countDocuments({
      userId,
      programId,
      activeStatus: false,
    });

    if (cancellationCount >= 3) {
      return res.status(400).json({
        message:
          "You cannot register for this program as you've canceled it multiple times.",
      });
    }

    // Check if the program has available seats (only counting active registrations)
    const activeRegistrations = await RegisteredUser.countDocuments({
      programId,
      activeStatus: true,
    });
    const program = await Program.findById(programId);

    if (activeRegistrations >= program.participants) {
      return res.status(400).json({
        message: "Registration is full. No seats available.",
      });
    }

    // Register the user if all checks pass
    const newRegistration = new RegisteredUser({
      userId,
      programId,
      registrationDate: new Date(),
      activeStatus: true,
    });

    await newRegistration.save();

    return res.status(201).json({
      message: "Successfully registered for the program.",
    });
  } catch (error) {
    console.error("Error registering for the program:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

router.get("/registeredPrograms/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch registered programs for the user from the RegisteredUser collection
    const registeredUsers = await RegisteredUser.find({
      userId: userId,
      activeStatus: true, // Only fetch active registrations
    }).populate("programId"); // Populate program details

    if (registeredUsers.length === 0) {
      return res
        .status(404)
        .json({ message: "No registered programs found for this user." });
    }

    // Format the response to merge RegisteredUser and Program data
    const mergedPrograms = registeredUsers
      .filter((regUser) => regUser.programId !== null) // Ensure programId is not null
      .map((regUser) => {
        const program = regUser.programId;

        return {
          _id: program._id,
          programName: program.programName,
          startDate: program.startDate,
          endDate: program.endDate,
          activeStatus: regUser.activeStatus,
          registrationDate: regUser.registrationDate,
          participants: program.participants,
          remainingSeats: program.participants - registeredUsers.length, // Calculating remaining seats
        };
      });

    res.status(200).json(mergedPrograms);
  } catch (error) {
    console.error("Error fetching registered programs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch registered programs.",
    });
  }
});

// Cancel registration for a program
router.put("/cancelRegistration/:userId/:programId", async (req, res) => {
  const { userId, programId } = req.params;

  try {
    // Update only the RegisteredUser table by setting activeStatus to false
    const updatedRegistration = await RegisteredUser.findOneAndUpdate(
      { userId, programId, activeStatus: true }, // Find the active registration
      { activeStatus: false }, // Set activeStatus to false
      { new: true }
    );

    if (!updatedRegistration) {
      return res.status(404).json({ message: "No active registration found" });
    }

    res.status(200).json({ message: "Registration canceled successfully" });
  } catch (error) {
    console.error("Error canceling registration:", error);
    res.status(500).json({ message: "Failed to cancel registration" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await RegisteredUser.find()
      .populate("userId", "firstName lastName email")
      .populate("programId", "programName");

    const response = users.map((registeredUser) => ({
      _id: registeredUser._id,
      name: `${registeredUser.userId.firstName} ${registeredUser.userId.lastName}`,
      email: registeredUser.userId.email,
      programName: registeredUser.programId.programName,
      status: registeredUser.activeStatus,
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user status
router.put("/user/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find the registered user by ID
    const userToUpdate = await RegisteredUser.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    // If status is already true and we're trying to set it to true again, deny the update
    if (userToUpdate.activeStatus === true && status === true) {
      return res.status(400).json({
        message:
          "This user is already active in this program. Cannot update status.",
      });
    }

    // If status is being updated to true (active)
    if (status === true) {
      // Check if another user is already active in the same program
      const activeUser = await RegisteredUser.findOne({
        programId: userToUpdate.programId,
        activeStatus: true,
        _id: { $ne: id },
      });

      if (activeUser) {
        // If an active user is found for the same program, deny the update
        return res.status(400).json({
          message:
            "Another user is already active for this program. Cannot set this user as active.",
        });
      }
    }

    // Proceed with the status update
    userToUpdate.activeStatus = status;
    await userToUpdate.save();

    res.json({ message: "User status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//public program list
router.get("/prgramlists", async (req, res) => {
  try {
    const programs = await Program.find(); // Fetch all programs from the database
    res.json(programs); // Return the programs as JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
