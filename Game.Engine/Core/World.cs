﻿namespace Game.Engine.Core
{
    using Game.Engine.Bots;
    using Game.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Numerics;
    using System.Threading;

    public class World : IDisposable
    {
        public List<Player> Players { get; } = new List<Player>();
        public List<Bullet> Bullets { get; } = new List<Bullet>();
        public List<GameObject> Objects { get; } = new List<GameObject>();
        public long Time { get; private set; } = 0;
        public long FrameNumber { get; private set; } = 0;
        public Vector2 WorldSize = new Vector2(6000, 6000);

        public Leaderboard Leaderboard { get; set; } = null;
        public bool IsLeaderboardNew = false;

        private readonly Timer heartbeat;
        private const int MS_PER_FRAME = 40;

        public World()
        {
            heartbeat = new Timer((state) =>
            {
                //Console.WriteLine($"Frame: {FrameNumber}");
                Step();
            }, null, 0, MS_PER_FRAME);


            for (int i = 1; i < 2; i++)
            {
                var bot = new Robot(this)
                {
                    Name = $"Daudelin #{i}",
                    Ship = "ship0"
                };
                AddPlayer(bot);
                bot.Spawn();
            }

        }

        public void Step()
        {
            Time += MS_PER_FRAME;
            FrameNumber += 1;

            lock (Objects)
            {
                IsLeaderboardNew = false;
                if (FrameNumber % 20 == 0)
                {
                    Leaderboard = new Leaderboard
                    {
                        Entries = Players
                            .Where(p => p.IsAlive)
                            .Select(p => new Leaderboard.Entry
                                {
                                    Name = p.Name,
                                    Score = p.Score
                                })
                                .OrderByDescending(e => e.Score)
                                .ToList()
                    };
                    IsLeaderboardNew = true;
                }

                foreach (var player in Players.ToList())
                    player.Step();
                foreach (var bullet in Bullets.ToArray())
                    bullet.Step();

                foreach (var obj in Objects.ToList())
                {
                    obj.LastPosition = obj.Position;
                    obj.Position += obj.Momentum;

                    if (Math.Abs(obj.Position.X) > WorldSize.X / 2
                        || Math.Abs(obj.Position.Y) > WorldSize.Y / 2)
                    {
                        var newPosition = obj.Position;

                        if (newPosition.X > WorldSize.X / 2)
                            newPosition.X = (-WorldSize.X / 2) + (newPosition.X - WorldSize.X / 2);
                        if (newPosition.X < WorldSize.X / -2)
                            newPosition.X = (WorldSize.X / 2) + (newPosition.X + WorldSize.X / 2);
                        if (newPosition.Y > WorldSize.Y / 2)
                            newPosition.Y = (-WorldSize.Y / 2) + (newPosition.Y - WorldSize.Y / 2);
                        if (newPosition.Y < WorldSize.Y / -2)
                            newPosition.Y = (WorldSize.Y / 2) + (newPosition.Y + WorldSize.Y / 2);

                        obj.Position = newPosition;
                        obj.LastPosition = newPosition;
                    }
                }
                foreach (var player in Players.ToList())
                    player.SetupView();
            }
            // update some stuff.
        }

        public void AddPlayer(Player player)
        {
            lock (Objects)
                player.Init();
        }

        public void RemovePlayer(Player player)
        {
            lock (Objects)
                player.Deinit();
        }

        public int PlayerCount
        {
            get
            {
                return Players.Count;
            }
        }

        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
                if (disposing)
                    heartbeat.Dispose();
                disposedValue = true;
        }
        void IDisposable.Dispose()
        {
            Dispose(true);
        }
        #endregion
    }
}
