const { User, Biodata, Room, Roundgame, Skoruser } = require('../models');
const { success, error, fail, } = require('../controllers/responseBuilder')
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");

const updateBiodata = async(req, res) => {
    let { name, birth_date, email, phone_number, address } = req.body;

    try {
        const biodatas = await User.findByPk(Number(req.user.id));

        if (!biodatas) return res.json({
            status: 'Not found!'
        });

        if (name == null && birth_date == null && email == null && phone_number == null && address == null) {
            return res.status(401).json(fail({
                message: 'Data cannot be empty'
            }));
        }

        const biodata = await Biodata.update({
            name,
            birth_date,
            email,
            phone_number,
            address
        }, {
            where: {
                id: req.user.id
            }
        });

        res.status(201).json(success({
            message: `Your Biodata updated`,
        }));

    } catch (error) {
        return res.status(500).json(error)
    }


}
const updateUser = async(req, res) => {
    let { username, password } = req.body;

    try {
        if (username == null && password == null) {
            return res.status(401).json(fail({
                message: 'Data cannot be empty'
            }));
        }
        const users = await User.findByPk(req.user.id);


        if (!users) return res.status(401).json(fail({
            message: 'Not found!'
        }));

        let encrypt = await bcrypt.hash(password, 10)

        const checkUser = await User.findAll({
            where: {
                username: username,
                [Op.not]: { id: req.user.id }
            }

        });


        if (checkUser.length > 0) {

            return res.status(401).json(fail({
                message: "username already use"
            }));
        }

        await User.update({
            username: username,
            password: encrypt,
        }, {
            where: {
                id: req.user.id
            }
        })

        res.status(201).json(success({
            message: `Your data updated`,
            username: username,
            password: password
        }));

    } catch (error) {
        return res.status(500).json(error)
    }

}

const deleteBiodata = async(req, res) => {
    const biodata = await Biodata.findOne({ where: ({ user_id: req.user.id }) });

    if (!biodata) return res.status(401).json(fail({
        message: 'Not found!'
    }));

    await biodata.destroy();
    res.status(201).json(success({
        message: 'Biodata deleted'
    }));
}
const deleteUser = async(req, res) => {
    const user = await User.findByPk(Number(req.user.id));

    if (!user) return res.status(401).json(fail({
        message: 'Not found!'
    }));

    await user.destroy();
    res.status(201).json(success({
        message: 'User deleted'
    }));
}

const addBiodata = async(req, res) => {
    let { name, birth_date, email, phone_number, address } = req.body;

    try {
        const checkUser = await Biodata.findAll({
            where: {
                user_id: req.user.id
            }
        });


        if (checkUser.length > 0) {

            return res.status(401).json(fail({
                message: "You already have biodata"
            }));
        }

        if (name == null && birth_date == null && email == null && phone_number == null && address == null) {
            return res.status(401).json(fail({
                message: 'Data cannot be empty'
            }));
        }

        const user = await User.findByPk(req.user.id);

        const biodata = await Biodata.create({
            name,
            birth_date,
            email,
            phone_number,
            address,
            user_id: user.id
        });
        console.log(await biodata.setUser(user));

        res.status(201).json({
            status: 'OK',
            biodata
        })

    } catch (error) {
        return res.status(500).json(error)

    }


}

const getBiodata = async(req, res) => {
    const biodata = await Biodata.findOne({
        include: [{ model: User, attributes: ['username'] }],
        where: {
            id: req.user.id

        }
    })
    res.status(201).json({
        status: 'OK',
        biodata
    })
}

const createRoom = async(req, res) => {

    try {

        const token = req.user;
        // console.log(token.id)
        if (req.body.room_name == null) {
            res.status(401).json(fail({
                message: 'Room name cannot be null'
            }))
        } else if (token.id != null) {
            const room = await Room.create({
                room_name: req.body.room_name,
                player_one_id: token.id
            });

            res.status(201).json(success({
                ID_Room: room.id,
                Room: room.room_name,
                message: `For your opponent, please acces /enter-room/${room.id} to join the game`

            }));
        }
    } catch (error) {
        return res.status(500).json(error)

    }
}


const enterRoom = async(req, res) => {
    try {
        const room = await Room.findByPk(Number(req.params.id));
        const user = req.user;

        if (room.player_two_id === null) {
            await Room.update({
                player_two_id: user.id
            }, {
                where: {
                    id: req.params.id
                }
            })
            res.status(201).json(success({
                message: 'Succes enter room!'
            }))

        } else {
            res.status(401).json(fail({
                message: `Room ID ${req.params.id} full member`
            }))
        }
    } catch (error) {
        return res.status(500).json(error)

    }
}

//Fight Room

const roundGame = async(req, res) => {
    try {
        const user = req.user

        const { player_one_option } = req.body

        const room = await Room.findByPk(Number(req.params.id))
        const round = await Roundgame.findOne({
            limit: 1,
            where: { room_id: req.params.id },
            order: [
                ['createdAt', 'DESC']
            ]
        })
        const count_round = await Roundgame.count({ where: { room_id: req.params.id } })

        if (validate(player_one_option.toUpperCase()) == false) {
            return res.status(401).json(fail({
                message: `Option invalid`
            }))
        }
        if (round == null) {
            if (user.id === room.player_one_id) {
                if (player_one_option == null) {
                    res.status(401).json(fail({
                        message: 'Option cannot be null'
                    }));
                } else {


                    await Roundgame.create({
                        room_id: req.params.id,
                        round_number: 1,
                        player_one_option: player_one_option
                    })
                    res.status(201).json(success({
                        round_number: 1,
                        player_one_option
                    }));
                }
            }
        } else if (count_round === 3) {
            res.status(201).json({
                winner_result: ` Room ${round.room_id} final result ${room.game_result}`,
                message: `Room closed. Access /api/v1/gamehistories/${round.room_id} to see record game in this room`
            });
        } else if (round.player_two_option == null) {
            res.status(401).json(fail({
                message: 'Waiting player 2 to insert the option..'
            }));
        } else {

            if (user.id === room.player_one_id) {
                if (player_one_option == null) {
                    res.status(401).json(fail({
                        message: 'Option cannot be null'
                    }));
                } else {

                    // console.log(count_round)
                    await Roundgame.create({
                        room_id: req.params.id,
                        round_number: round.round_number + 1,
                        player_one_option: player_one_option
                    })
                    res.status(201).json(success({
                        round_number: round.round_number + 1,
                        player_one_option
                    }));
                }

            }
        }
    } catch (error) {
        return res.status(500).json(error)

    }
}


const updateRound = async(req, res) => {

    try {
        const user = req.user

        const { player_two_option } = req.body

        const room = await Room.findByPk(Number(req.params.id))
        console.log(room.player_two_id)
        const round = await Roundgame.findOne({
            limit: 1,
            where: { room_id: req.params.id },
            order: [
                ['createdAt', 'DESC']
            ]
        });

        const last_round = await Roundgame.findAll()

        const length_round = last_round.length
        const last_round_id = last_round[length_round - 1];


        const count_round = await Roundgame.count({ where: { room_id: req.params.id } })


        if (user.id === room.player_two_id) {
            if (player_two_option == null) {
                res.status(401).json(fail({
                    message: 'Option cannot be null'
                }));
            } else {
                if (validate(player_two_option.toUpperCase()) == false) {
                    return res.status(401).json(fail({
                        message: `Option invalid`
                    }))
                }
                winner = resultGame(round.player_one_option.toUpperCase(), player_two_option.toUpperCase(), room.player_one_id, room.player_two_id)
                console.log(winner)
                await Roundgame.update({
                    player_two_option,
                    winner: winner[0],
                    winner_id: winner[1]
                }, {
                    where: {
                        room_id: req.params.id,
                        round_number: last_round_id.dataValues.round_number
                    }
                });

                if (count_round == 3) {


                    const all_round = await Roundgame.findAll({ where: { room_id: req.params.id } });
                    const get_id = await Room.findOne({ where: { id: req.params.id } });
                    const pl_one = get_id.player_one_id;
                    const pl_two = get_id.player_two_id;

                    const result_p1 = all_round.filter(i => i.dataValues.winner_id == pl_one).length;
                    const result_p2 = all_round.filter(i => i.dataValues.winner_id == pl_two).length;

                    if (result_p1 > result_p2) {

                        await Room.update({
                            game_result: 'PLAYER 1 WIN',
                            final_id: pl_one
                        }, {
                            where: {
                                id: req.params.id
                            }
                        });

                        const skor = await Room.count({ where: { final_id: pl_one } });
                        console.log(skor)
                        const hasil = await Skoruser.update({
                            skor: skor
                        }, {
                            where: { user_id: pl_one }
                        })

                    } else if (result_p1 < result_p2) {
                        await Room.update({
                            game_result: 'PLAYER 2 WIN',
                            final_id: pl_two
                        }, {
                            where: {
                                id: req.params.id
                            }
                        })


                        const skor = await Room.count({ where: { final_id: pl_two } });
                        console.log(skor)
                        const hasil = await Skoruser.update({
                            skor: skor
                        }, {
                            where: { user_id: pl_two }
                        })

                        // console.log(hasil)

                    } else if (result_p1 === result_p2) {
                        await Room.update({
                            game_result: 'DRAW',
                            final_id: 0
                        }, {
                            where: {
                                id: req.params.id
                            }
                        })
                    }



                }
            }
            const final = await Room.findByPk(Number(req.params.id));
            const record = await Roundgame.findAll({ where: { room_id: req.params.id } })
            if (final.game_result != null) {

                res.status(201).json(success({

                    Room_ID: round.room_id,
                    record,

                    winner_result: `Room ${round.room_id} final result ${final.game_result}`,
                }));
            } else {
                res.status(201).json(success({
                    Room_ID: round.room_id,
                    round_number: round.round_number,
                    player_one_option: round.player_one_option,
                    player_two_option: player_two_option,
                    winner: `This round result: ${winner[0]}`,

                }));

            }
        }
    } catch (error) {
        return res.status(500).json(error)

    }
}


const gameHistory = async(req, res) => {
    // const record = await Roundgame.findAll({ where: { room_id: req.params.id } });
    const room = await Room.findAll({
        where: {
            [Op.or]: [
                { player_one_id: req.user.id },
                { player_two_id: req.user.id }
            ]
        }
    });
    res.status(201).json(success({
        room
    }));


}

const generateSkor = async(req, res) => {

    const skor = await Skoruser.findOne({ where: { user_id: req.user.id } });
    const user = await User.findOne({ where: { id: req.user.id } })
    console.log(skor)

    res.status(201).json(success({
        username: user.username,
        skor: skor.skor
    }))
}

function validate(option) {
    if (option != 'ROCK' && option != 'SCISSORS' && option != 'PAPER') {
        return false
    } else {
        return true
    }
}

function resultGame(player_one_option, player_two_option, player_one_id, player_two_id) {
    if (player_one_option === player_two_option) {
        return ['DRAW', 0]
    } else if ((player_one_option === 'ROCK' && player_two_option === 'SCISSORS') ||
        (player_one_option === 'PAPER' && player_two_option === 'ROCK') ||
        (player_one_option === 'SCISSORS' && player_two_option === 'PAPER')) {
        return ['PLAYER 1 WIN', player_one_id]
    } else if ((player_one_option === 'SCISSORS' && player_two_option === 'ROCK') ||
        (player_one_option === 'ROCK' && player_two_option === 'PAPER') ||
        (player_one_option === 'PAPER' && player_two_option === 'SCISSORS')) {
        return ['PLAYER 2 WIN', player_two_id]
    }
}





module.exports = { createRoom, updateBiodata, getBiodata, deleteBiodata, addBiodata, updateUser, deleteUser, enterRoom, roundGame, updateRound, generateSkor, gameHistory };