const { Client, ChannelType } = require("discord.js")
const config = require('./config.json');
const SoftUI = require('dbd-soft-ui');
let DBD = require('discord-dashboard');
const PermissionsDB = require("../../Structures/Schemas/Permissions")
const WelcomeDB = require("../../Structures/Schemas/Welcome")
const GeneralLogsDB = require("../../Structures/Schemas/LogsChannel")
const LogsSwitchDB = require("../../Structures/Schemas/GeneralLogs")
const ChannelDB = require("../../Structures/Schemas/LevelUpChannel")
const voiceDB = require("../../Structures/Schemas/VoiceSystem")

module.exports = {
    name: "ready",

    /**
     * @param {Client} client 
     */
    async execute(client) {

        const { user } = client

        let Information = []
        let Moderation = []
        let Economy = []
        let Community = []

        const info = client.commands.filter(x => x.category === "Information")
        const mod = client.commands.filter(x => x.category === "Moderation")
        const eco = client.commands.filter(x => x.category === "Economy")
        const com = client.commands.filter(x => x.category === "Community")

        CommandPush(info, Information)
        CommandPush(mod, Moderation)
        CommandPush(eco, Economy)
        CommandPush(com, Community)

        await DBD.useLicense(config.dbd.license)
        DBD.Dashboard = DBD.UpdatedClass()

        const Dashboard = new DBD.Dashboard({

            port: config.dbd.port,
            client: config.discord.client,
            redirectUri: `${config.dbd.domain}${config.dbd.redirectUri}`,
            domain: config.dbd.domain,
            ownerIDs: config.dbd.ownerIDs,
            useThemeMaintenance: true,
            useTheme404: true,
            acceptPrivacyPolicy: true,
            bot: client,
            guildAfterAuthorization: {
                use: true,
                guildId: "1057986397081980948"
            },
            theme: SoftUI({
                locales: {
                    enUS: {
                        name: 'English',
                        index: {
                            feeds: ["Current Users", "CPU", "System Platform", "Server Count"],
                            card: {
                                category: "zeenbot",
                                title: "zeenbot's new Panel - The center of everything",
                                description: "Welcome to the zeenbot panel where you can control the core features to the bot.",
                                footer: "Invite the Bot",
                                link: {
                                    enabled: true,
                                    url: "https://discord.com/api/oauth2/authorize?client_id=1047099666182967317&permissions=8&scope=bot%20applications.commands"
                                }
                            },
                            feedsTitle: "Feeds",
                            graphTitle: "Graphs",
                        },
                        blacklisted: {
                            title: "Blacklisted",
                            subtitle: "Access denied",
                            description: "Unfortunately it seems that you have been blacklisted from the dashboard.",
                            button: {
                                enabled: false,
                                text: "Return",
                                link: "https://google.com"
                            }
                        },
                        manage: {
                            settings: {
                                memberCount: "Members",
                                info: {
                                    info: "Info",
                                    server: "Server Information"
                                }
                            }
                        },
                        privacyPolicy: {
                            title: "Privacy Policy",
                            description: "Privacy Policy and Terms of Service",
                            pp: "Complete Privacy Policy",
                        },
                        partials: {
                            sidebar: {
                                dash: "Dashboard",
                                manage: "Manage Guilds",
                                commands: "Commands",
                                pp: "Privacy Policy",
                                admin: "Admin",
                                account: "Account Pages",
                                login: "Sign In",
                                logout: "Sign Out"
                            },
                            navbar: {
                                home: "Home",
                                pages: {
                                    manage: "Manage Guilds",
                                    settings: "Manage Guilds",
                                    commands: "Commands",
                                    pp: "Privacy Policy",
                                    admin: "Admin Panel",
                                    error: "Error",
                                    credits: "Credits",
                                    debug: "Debug",
                                    leaderboard: "Leaderboard",
                                    profile: "Profile",
                                    maintenance: "Under Maintenance",
                                }
                            },
                            title: {
                                pages: {
                                    manage: "Manage Guilds",
                                    settings: "Manage Guilds",
                                    commands: "Commands",
                                    pp: "Privacy Policy",
                                    admin: "Admin Panel",
                                    error: "Error",
                                    credits: "Credits",
                                    debug: "Debug",
                                    leaderboard: "Leaderboard",
                                    profile: "Profile",
                                    maintenance: "Under Maintenance",
                                }
                            },
                            preloader: {
                                text: "Page is loading..."
                            },
                            premium: {
                                title: "Want more from zeenbot?",
                                description: "Check out premium features below!",
                                buttonText: "Get Premium",
                                button: {
                                    url: "https://google.com"
                                }
                            },
                            settings: {
                                title: "Site Configuration",
                                description: "Configurable Viewing Options",
                                theme: {
                                    title: "Site Theme",
                                    description: "Make the site more appealing for your eyes!",
                                },
                                language: {
                                    title: "Site Language",
                                    description: "Select your preffered language!",
                                }
                            }
                        }
                    },
                    deDE: {
                        name: 'Deutsch',
                        index: {
                            feeds: ["Current Users", "CPU", "System Platform", "Server Count"],
                            card: {
                                category: "zeenbot",
                                title: "zeenbot's neues Panel - The Zentrum von allem",
                                description: "Herzlich willkommen im zeenbot-Panel, wo Sie die Kernfunktionen des Bots steuern können.",
                                footer: "Lade den Bot ein",
                                link: {
                                    enabled: true,
                                    url: "https://discord.com/api/oauth2/authorize?client_id=1047099666182967317&permissions=8&scope=bot%20applications.commands"
                                }
                            },
                            feedsTitle: "Feeds",
                            graphTitle: "Graphen",
                        },
                        blacklisted: {
                            title: "Blacklisted",
                            subtitle: "Zugriff verweigert",
                            description: "Leider sieht es so aus, als wärst du für das Dashboard gesperrt.",
                            button: {
                                enabled: false,
                                text: "Return",
                                link: "https://google.com"
                            }
                        },
                        manage: {
                            settings: {
                                memberCount: "Mitglieder",
                                info: {
                                    info: "Info",
                                    server: "Server Informationen"
                                }
                            }
                        },
                        privacyPolicy: {
                            title: "Datenschutzbestimmungen",
                            description: "DDatenschutzbestimmungen und ABGs",
                            pp: "Datenschutzbestimmungen",
                        },
                        partials: {
                            sidebar: {
                                dash: "Dashboard",
                                manage: "Server verwalten",
                                commands: "Commands",
                                pp: "Datenschutzbestimmungen",
                                admin: "Admin",
                                account: "Account Seite",
                                login: "Anmelden",
                                logout: "Abmelden"
                            },
                            navbar: {
                                home: "Home",
                                pages: {
                                    manage: "Server verwalten",
                                    settings: "Server verwalten",
                                    commands: "Commands",
                                    pp: "Datenschutzbestimmungen",
                                    admin: "Admin Panel",
                                    error: "Error",
                                    credits: "Credits",
                                    debug: "Debug",
                                    leaderboard: "Leaderboard",
                                    profile: "Profil",
                                    maintenance: "Wartungsarbeiten",
                                }
                            },
                            title: {
                                pages: {
                                    manage: "Server verwalten",
                                    settings: "Server verwalten",
                                    commands: "Commands",
                                    pp: "Datenschutzbestimmungen",
                                    admin: "Admin Panel",
                                    error: "Error",
                                    credits: "Credits",
                                    debug: "Debug",
                                    leaderboard: "Leaderboard",
                                    profile: "Profil",
                                    maintenance: "Wartungsarbeiten",
                                }
                            },
                            preloader: {
                                text: "Seite lädt..."
                            },
                            premium: {
                                title: "Du willst mehr von zeenbot?",
                                description: "Sieht dir unsere Premium Features an!",
                                buttonText: "Premium erhalten",
                                button: {
                                    url: "https://google.com"
                                }
                            },
                            settings: {
                                title: "Webseiten Konfiguration",
                                description: "Verfügbare Einstellunge",
                                theme: {
                                    title: "Seiten Thema",
                                    description: "Passe die Seite an!",
                                },
                                language: {
                                    title: "Sprache",
                                    description: "Wähle deine Sprache aus!",
                                }
                            }
                        }
                    }
                },
                customThemeOptions: {
                    index: async ({ req, res, config }) => {
                        return {
                            values: [],
                            graph: {},
                            cards: [],
                        }
                    },
                },
                websiteName: "zeenbot",
                colorScheme: "yellow",
                supporteMail: "support@szeenbot.de",
                icons: {
                    favicon: 'https://cdn.discordapp.com/attachments/1041329286969294858/1058348553715580938/z-black.png',
                    noGuildIcon: "https://cdn.discordapp.com/attachments/1041329286969294858/1058321546197868625/abstract-black-low-poly-wallpaper-preview.jpeg",
                    sidebar: {
                        darkUrl: 'https://cdn.discordapp.com/attachments/1041329286969294858/1058348553392627723/z-white.png',
                        lightUrl: 'https://cdn.discordapp.com/attachments/1041329286969294858/1058348553715580938/z-black.png',
                        hideName: true,
                        borderRadius: false,
                        alignCenter: true
                    },
                },
                index: {
                    card: {
                        category: "zeenbot",
                        title: "zeenbot's new Panel - The center of everything",
                        description: "Welcome to the zeenbot panel where you can control the core features to the bot.",
                        image: "https://cdn.discordapp.com/attachments/1041329286969294858/1044984586528096286/zlogo.png",
                        footer: "Invite the Bot",
                        link: {
                            enabled: true,
                            url: "https://discord.com/api/oauth2/authorize?client_id=1047099666182967317&permissions=8&scope=bot%20applications.commands"
                        }
                    },
                    graph: {
                        enabled: false,
                        lineGraph: false,
                        title: 'Memory Usage',
                        tag: 'Memory (MB)',
                        max: 100
                    },
                },
                blacklisted: {
                    title: "Blacklisted",
                    subtitle: "Access denied",
                    description: "Unfortunately it seems that you have been blacklisted from the dashboard.",
                    button: {
                        enabled: false,
                        text: "Return",
                        link: "https://google.com"
                    }
                },
                sweetalert: {
                    errors: {},
                    success: {
                        login: "Successfully logged in.",
                    }
                },
                preloader: {
                    image: "https://cdn.discordapp.com/attachments/1041329286969294858/1044984586528096286/zlogo.png",
                    spinner: false,
                    text: "Page is loading",
                },
                premium: {
                    enabled: true,
                    card: {
                        title: "Want more from zeenbot?",
                        description: "Check out premium features below!",
                        bgImage: "https://cdn.discordapp.com/attachments/1041329286969294858/1044984586528096286/zlogo.png",
                        button: {
                            text: "Become Premium",
                            url: "https://google.comgoogle.de"
                        }
                    }
                },
                admin: {
                    pterodactyl: {
                        enabled: false,
                        apiKey: "apiKey",
                        panelLink: "https://panel.website.com",
                        serverUUIDs: []
                    }
                },

                commands: [
                    {
                        category: "Information",
                        subTitle: "Information Commands",
                        aliasesDisabled: false,
                        list: Information
                    },
                    {
                        category: "Economy",
                        subTitle: "Economy Commands",
                        aliasesDisabled: false,
                        list: Economy
                    },
                    {
                        category: "Community",
                        subTitle: "Community Commands",
                        aliasesDisabled: false,
                        list: Community
                    },
                    {
                        category: "Moderation",
                        subTitle: "Moderation Commands",
                        aliasesDisabled: false,
                        list: Moderation
                    },
                ],

            }),
            settings: [

                // Permissions
                {
                    categoryId: "permissions",
                    categoryName: "Permissions",
                    categoryDescription: "Setup the permissions for the bot",
                    categoryImageURL: 'https://cdn.discordapp.com/attachments/1041329286969294858/1058429901000159293/permission.png',
                    categoryOptionsList: [
                        {
                            optionId: "mods",
                            optionName: "Moderators",
                            optionDescription: "Set the role for the mods",
                            optionType:  DBD.formTypes.rolesSelect(false),
                            getActualSet: async ({ guild }) => {
                                let data = await PermissionsDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.ID
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {

                                let data = await PermissionsDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = null

                                if (!data) {

                                    data = new PermissionsDB({
                                        Guild: guild.id,
                                        ID: newData,
                                    })

                                    await data.save()

                                } else {

                                    data.ID = newData
                                    await data.save()

                                }

                                return

                            }
                        }
                    ]
                },

                // Welcome System

                {
                    categoryId: "welcome",
                    categoryName: "Welcome System",
                    categoryDescription: "Setup the Welcome Channel",
                    categoryImageURL: 'https://cdn.discordapp.com/attachments/1041329286969294858/1058429901549600768/welcome.png',
                    categoryOptionsList: [
                        {
                            optionId: "welch",
                            optionName: "Welcome Channel",
                            optionDescription: "Set or reset the server's welcome channel",
                            optionType: DBD.formTypes.channelsSelect(false, channelTypes = [ChannelType.GuildText]),
                            getActualSet: async ({ guild }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Channel
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {

                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = null

                                if (!data) {

                                    data = new WelcomeDB({
                                        Guild: guild.id,
                                        Channel: newData,
                                        DM: false,
                                        DMMessage: null,
                                        Content: false,
                                        Embed: false
                                    })

                                    await data.save()

                                } else {

                                    data.Channel = newData
                                    await data.save()

                                }

                                return

                            }
                        },
                        {
                            optionId: "weldm",
                            optionName: "Welcome DM",
                            optionDescription: "Enable or Disable Welcome Message (in DM)",
                            optionType: DBD.formTypes.switch(false),
                            getActualSet: async ({ guild }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.DM
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {

                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new WelcomeDB({
                                        Guild: guild.id,
                                        Channel: null,
                                        DM: newData,
                                        DMMessage: null,
                                        Content: false,
                                        Embed: false
                                    })

                                    await data.save()

                                } else {

                                    data.DM = newData
                                    await data.save()

                                }

                                return

                            }
                        },
                        {
                            optionId: "weldmopt",
                            optionName: "Welcome DM Options",
                            optionDescription: "Send Content",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    first: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Content
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {

                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new WelcomeDB({
                                        Guild: guild.id,
                                        Channel: null,
                                        DM: false,
                                        DMMessage: null,
                                        Content: newData,
                                        Embed: false
                                    })

                                    await data.save()

                                } else {

                                    data.Content = newData
                                    await data.save()

                                }

                                return

                            }
                        },
                        {
                            optionId: "welcembed",
                            optionName: "",
                            optionDescription: "Send Embed",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    last: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Embed
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {

                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new WelcomeDB({
                                        Guild: guild.id,
                                        Channel: null,
                                        DM: false,
                                        DMMessage: null,
                                        Content: false,
                                        Embed: newData
                                    })

                                    await data.save()

                                } else {

                                    data.Embed = newData
                                    await data.save()

                                }

                                return

                            }
                        },
                        {
                            optionId: "weldmmsg",
                            optionName: "Welcome Message (In DM)",
                            optionDescription: "Send a message to DM of newly joined member",
                            optionType: DBD.formTypes.embedBuilder({
                                username: user.username,
                                avatarURL: user.avatarURL(),
                                defaultJson: {
                                    content: "Welcome",
                                    embed: {
                                        description: "Welcome"
                                    }
                                }
                            }),
                            getActualSet: async ({ guild }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.DMMessage
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {

                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new WelcomeDB({
                                        Guild: guild.id,
                                        Channel: null,
                                        DM: false,
                                        DMMessage: newData,
                                        Content: false,
                                        Embed: false
                                    })

                                    await data.save()

                                } else {

                                    data.DMMessage = newData
                                    await data.save()

                                }

                                return

                            }
                        },
                    ]
                },

                // Logging System

                {
                    categoryId: "logs",
                    categoryName: "Logging System",
                    categoryDescription: "Setup channels for General & Invite Logger",
                    categoryImageURL: 'https://cdn.discordapp.com/attachments/1041329286969294858/1058429900584910948/log.png',
                    categoryOptionsList: [
                        {
                            optionId: "gench",
                            optionName: "General Logger Channel",
                            optionDescription: "Set or reset the server's logger channel",
                            optionType: DBD.formTypes.channelsSelect(false, channelTypes = [ChannelType.GuildText]),
                            getActualSet: async ({ guild }) => {
                                let data = await GeneralLogsDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Channel
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {

                                let data = await GeneralLogsDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = null

                                if (!data) {

                                    data = new GeneralLogsDB({
                                        Guild: guild.id,
                                        Channel: newData,
                                        DM: false,
                                        DMMessage: null,
                                        Content: false,
                                        Embed: false
                                    })

                                    await data.save()

                                } else {

                                    data.Channel = newData
                                    await data.save()

                                }

                                return

                            }
                        },
                        {
                            optionId: "ignch",
                            optionName: "Ignored Categories",
                            optionDescription: "Set or reset the categories to be ignored",
                            optionType: DBD.formTypes.channelsMultiSelect(false, false, channelTypes = [ChannelType.GuildCategory]),
                            getActualSet: async ({ guild }) => {
                                let data = await GeneralLogsDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.IgnoreChannels
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {

                                let data = await GeneralLogsDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = null

                                if (!data) {

                                    data = new GeneralLogsDB({
                                        Guild: guild.id,
                                        IgnoreChannels: newData,
                                    })

                                    await data.save()

                                } else {

                                    data.IgnoreChannels = newData
                                    await data.save()

                                }

                                return

                            }
                        },
                        {
                            optionId: "memrole",
                            optionName: "Configure Logger System",
                            optionDescription: "Member Role",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    first: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.MemberRole
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {

                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        MemberRole: newData
                                    })

                                    await data.save()

                                } else {

                                    data.MemberRole = newData
                                    await data.save()

                                }

                                return

                            }
                        },
                        {
                            optionId: "memnick",
                            optionName: "",
                            optionDescription: "Member Nickname",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.MemberNick
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {

                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        MemberNick: newData
                                    })

                                    await data.save()

                                } else {

                                    data.MemberNick = newData
                                    await data.save()

                                }

                                return

                            }
                        },
                        {
                            optionId: "chntpc",
                            optionName: "",
                            optionDescription: "Channel Topic",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true,
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.ChannelTopic
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {

                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        ChannelTopic: newData
                                    })

                                    await data.save()

                                } else {

                                    data.ChannelTopic = newData
                                    await data.save()

                                }

                                return

                            }
                        },
                        {
                            optionId: "membst",
                            optionName: "",
                            optionDescription: "Member Boost",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    last: true,
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.MemberBoost
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {

                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        MemberBoost: newData
                                    })

                                    await data.save()

                                } else {

                                    data.MemberBoost = newData
                                    await data.save()

                                }

                                return

                            }
                        },
                        {
                            optionId: "rolest",
                            optionName: "",
                            optionDescription: "Role Status",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    first: true,
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.RoleStatus
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {

                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        RoleStatus: newData
                                    })

                                    await data.save()

                                } else {

                                    data.RoleStatus = newData
                                    await data.save()

                                }

                                return

                            }
                        },
                        {
                            optionId: "chnst",
                            optionName: "",
                            optionDescription: "Channel Status",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true,
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.ChannelStatus
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {

                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        ChannelStatus: newData
                                    })

                                    await data.save()

                                } else {

                                    data.ChannelStatus = newData
                                    await data.save()

                                }

                                return

                            }
                        },
                        {
                            optionId: "emjst",
                            optionName: "",
                            optionDescription: "Emoji Status",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true,
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.EmojiStatus
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {

                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        EmojiStatus: newData
                                    })

                                    await data.save()

                                } else {

                                    data.EmojiStatus = newData
                                    await data.save()

                                }

                                return

                            }
                        },
                        {
                            optionId: "memban",
                            optionName: "",
                            optionDescription: "Member Ban",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    last: true,
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.MemberBan
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {

                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        MemberBan: newData
                                    })

                                    await data.save()

                                } else {

                                    data.MemberBan = newData
                                    await data.save()

                                }

                                return

                            }
                        },
                    ]
                },

                // Level
                {
                    categoryId: "level",
                    categoryName: "Levels",
                    categoryDescription: "Setup the level system for the bot",
                    categoryImageURL: 'https://cdn.discordapp.com/attachments/1041329286969294858/1058429900173877358/level.png',
                    categoryOptionsList: [
                        {
                            optionId: "levelchannel",
                            optionName: "Level Up Channel",
                            optionDescription: "Set the channel for the level up notifications",
                            optionType: DBD.formTypes.channelsSelect(false, channelTypes = [ChannelType.GuildText]),
                            getActualSet: async ({ guild }) => {
                                let data = await ChannelDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Channel
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {

                                let data = await ChannelDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = null

                                if (!data) {

                                    data = new ChannelDB({
                                        Guild: guild.id,
                                        Channel: newData,
                                    })

                                    await data.save()

                                } else {

                                    data.Channel = newData
                                    await data.save()

                                }

                                return

                            }
                        }
                    ]
                },

                // Voice Hubs
                {
                    categoryId: "voicehubs",
                    categoryName: "Voice Hubs",
                    categoryDescription: "Setup the voice Hub for the server",
                    categoryImageURL: 'https://static.thenounproject.com/png/1912211-200.png',
                    categoryOptionsList: [
                        {
                            optionId: "hub",
                            optionName: "Hub",
                            optionDescription: "Set the channel for the voice hub",
                            optionType: DBD.formTypes.channelsSelect(false, channelTypes = [ChannelType.GuildVoice]),
                            getActualSet: async ({ guild }) => {
                                let data = await voiceDB.findOne({ GuildID: guild.id }).catch(err => { })
                                if (data) return data.ChannelID
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {

                                let data = await voiceDB.findOne({ GuildID: guild.id }).catch(err => { })

                                if (!newData) newData = null

                                if (!data) {

                                    data = new voiceDB({
                                        GuildID: guild.id,
                                        ChannelID: newData,
                                    })

                                    await data.save()

                                } else {

                                    data.ChannelID = newData
                                    await data.save()

                                }

                                return

                            }
                        }
                    ]
                },

            ]

        })

        Dashboard.init()

    }
}

function CommandPush(filteredArray, CategoryArray) {

    filteredArray.forEach(obj => {

        let cmdObject = {
            commandName: obj.name,
            commandUsage: "/" + obj.name,
            commandDescription: obj.description,
            commandAlias: "None"
        }

        CategoryArray.push(cmdObject)

    })

}