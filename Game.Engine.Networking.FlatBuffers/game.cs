// <auto-generated>
//  automatically generated by the FlatBuffers compiler, do not modify
// </auto-generated>

namespace Game.Engine.Networking.FlatBuffers
{

using global::System;
using global::Google.FlatBuffers;

public enum AllMessages : byte
{
 NONE = 0,
 NetWorldView = 1,
 NetSpawn = 2,
 NetControlInput = 3,
 NetPing = 4,
 NetLeaderboard = 5,
};

public struct NetLeaderboard : IFlatbufferObject
{
  private Table __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public static NetLeaderboard GetRootAsNetLeaderboard(ByteBuffer _bb) { return GetRootAsNetLeaderboard(_bb, new NetLeaderboard()); }
  public static NetLeaderboard GetRootAsNetLeaderboard(ByteBuffer _bb, NetLeaderboard obj) { return (obj.__assign(_bb.GetInt(_bb.Position) + _bb.Position, _bb)); }
  public void __init(int _i, ByteBuffer _bb) { __p.bb_pos = _i; __p.bb = _bb; }
  public NetLeaderboard __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public string Type { get { int o = __p.__offset(4); return o != 0 ? __p.__string(o + __p.bb_pos) : null; } }
#if ENABLE_SPAN_T
  public Span<byte> GetTypeBytes() { return __p.__vector_as_span(4); }
#else
  public ArraySegment<byte>? GetTypeBytes() { return __p.__vector_as_arraysegment(4); }
#endif
  public NetLeaderboardEntry? Entries(int j) { int o = __p.__offset(6); return o != 0 ? (NetLeaderboardEntry?)(new NetLeaderboardEntry()).__assign(__p.__indirect(__p.__vector(o) + j * 4), __p.bb) : null; }
  public int EntriesLength { get { int o = __p.__offset(6); return o != 0 ? __p.__vector_len(o) : 0; } }
  public NetLeaderboardEntry? Record { get { int o = __p.__offset(8); return o != 0 ? (NetLeaderboardEntry?)(new NetLeaderboardEntry()).__assign(__p.__indirect(o + __p.bb_pos), __p.bb) : null; } }

  public static Offset<NetLeaderboard> CreateNetLeaderboard(FlatBufferBuilder builder,
      StringOffset typeOffset = default(StringOffset),
      VectorOffset entriesOffset = default(VectorOffset),
      Offset<NetLeaderboardEntry> recordOffset = default(Offset<NetLeaderboardEntry>)) {
    builder.StartObject(3);
    NetLeaderboard.AddRecord(builder, recordOffset);
    NetLeaderboard.AddEntries(builder, entriesOffset);
    NetLeaderboard.AddType(builder, typeOffset);
    return NetLeaderboard.EndNetLeaderboard(builder);
  }

  public static void StartNetLeaderboard(FlatBufferBuilder builder) { builder.StartObject(3); }
  public static void AddType(FlatBufferBuilder builder, StringOffset typeOffset) { builder.AddOffset(0, typeOffset.Value, 0); }
  public static void AddEntries(FlatBufferBuilder builder, VectorOffset entriesOffset) { builder.AddOffset(1, entriesOffset.Value, 0); }
  public static VectorOffset CreateEntriesVector(FlatBufferBuilder builder, Offset<NetLeaderboardEntry>[] data) { builder.StartVector(4, data.Length, 4); for (int i = data.Length - 1; i >= 0; i--) builder.AddOffset(data[i].Value); return builder.EndVector(); }
  public static void StartEntriesVector(FlatBufferBuilder builder, int numElems) { builder.StartVector(4, numElems, 4); }
  public static void AddRecord(FlatBufferBuilder builder, Offset<NetLeaderboardEntry> recordOffset) { builder.AddOffset(2, recordOffset.Value, 0); }
  public static Offset<NetLeaderboard> EndNetLeaderboard(FlatBufferBuilder builder) {
    int o = builder.EndObject();
    return new Offset<NetLeaderboard>(o);
  }
};

public struct NetLeaderboardEntry : IFlatbufferObject
{
  private Table __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public static NetLeaderboardEntry GetRootAsNetLeaderboardEntry(ByteBuffer _bb) { return GetRootAsNetLeaderboardEntry(_bb, new NetLeaderboardEntry()); }
  public static NetLeaderboardEntry GetRootAsNetLeaderboardEntry(ByteBuffer _bb, NetLeaderboardEntry obj) { return (obj.__assign(_bb.GetInt(_bb.Position) + _bb.Position, _bb)); }
  public void __init(int _i, ByteBuffer _bb) { __p.bb_pos = _i; __p.bb = _bb; }
  public NetLeaderboardEntry __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public string Name { get { int o = __p.__offset(4); return o != 0 ? __p.__string(o + __p.bb_pos) : null; } }
#if ENABLE_SPAN_T
  public Span<byte> GetNameBytes() { return __p.__vector_as_span(4); }
#else
  public ArraySegment<byte>? GetNameBytes() { return __p.__vector_as_arraysegment(4); }
#endif
  public int Score { get { int o = __p.__offset(6); return o != 0 ? __p.bb.GetInt(o + __p.bb_pos) : (int)0; } }
  public string Color { get { int o = __p.__offset(8); return o != 0 ? __p.__string(o + __p.bb_pos) : null; } }
#if ENABLE_SPAN_T
  public Span<byte> GetColorBytes() { return __p.__vector_as_span(8); }
#else
  public ArraySegment<byte>? GetColorBytes() { return __p.__vector_as_arraysegment(8); }
#endif
  public Vec2? Position { get { int o = __p.__offset(10); return o != 0 ? (Vec2?)(new Vec2()).__assign(o + __p.bb_pos, __p.bb) : null; } }
  public bool Token { get { int o = __p.__offset(12); return o != 0 ? 0!=__p.bb.Get(o + __p.bb_pos) : (bool)false; } }

  public static void StartNetLeaderboardEntry(FlatBufferBuilder builder) { builder.StartObject(5); }
  public static void AddName(FlatBufferBuilder builder, StringOffset nameOffset) { builder.AddOffset(0, nameOffset.Value, 0); }
  public static void AddScore(FlatBufferBuilder builder, int score) { builder.AddInt(1, score, 0); }
  public static void AddColor(FlatBufferBuilder builder, StringOffset colorOffset) { builder.AddOffset(2, colorOffset.Value, 0); }
  public static void AddPosition(FlatBufferBuilder builder, Offset<Vec2> positionOffset) { builder.AddStruct(3, positionOffset.Value, 0); }
  public static void AddToken(FlatBufferBuilder builder, bool token) { builder.AddBool(4, token, false); }
  public static Offset<NetLeaderboardEntry> EndNetLeaderboardEntry(FlatBufferBuilder builder) {
    int o = builder.EndObject();
    return new Offset<NetLeaderboardEntry>(o);
  }
};

public struct NetSpawn : IFlatbufferObject
{
  private Table __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public static NetSpawn GetRootAsNetSpawn(ByteBuffer _bb) { return GetRootAsNetSpawn(_bb, new NetSpawn()); }
  public static NetSpawn GetRootAsNetSpawn(ByteBuffer _bb, NetSpawn obj) { return (obj.__assign(_bb.GetInt(_bb.Position) + _bb.Position, _bb)); }
  public void __init(int _i, ByteBuffer _bb) { __p.bb_pos = _i; __p.bb = _bb; }
  public NetSpawn __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public string Name { get { int o = __p.__offset(4); return o != 0 ? __p.__string(o + __p.bb_pos) : null; } }
#if ENABLE_SPAN_T
  public Span<byte> GetNameBytes() { return __p.__vector_as_span(4); }
#else
  public ArraySegment<byte>? GetNameBytes() { return __p.__vector_as_arraysegment(4); }
#endif
  public string Ship { get { int o = __p.__offset(6); return o != 0 ? __p.__string(o + __p.bb_pos) : null; } }
#if ENABLE_SPAN_T
  public Span<byte> GetShipBytes() { return __p.__vector_as_span(6); }
#else
  public ArraySegment<byte>? GetShipBytes() { return __p.__vector_as_arraysegment(6); }
#endif
  public string Color { get { int o = __p.__offset(8); return o != 0 ? __p.__string(o + __p.bb_pos) : null; } }
#if ENABLE_SPAN_T
  public Span<byte> GetColorBytes() { return __p.__vector_as_span(8); }
#else
  public ArraySegment<byte>? GetColorBytes() { return __p.__vector_as_arraysegment(8); }
#endif
  public string Token { get { int o = __p.__offset(10); return o != 0 ? __p.__string(o + __p.bb_pos) : null; } }
#if ENABLE_SPAN_T
  public Span<byte> GetTokenBytes() { return __p.__vector_as_span(10); }
#else
  public ArraySegment<byte>? GetTokenBytes() { return __p.__vector_as_arraysegment(10); }
#endif

  public static Offset<NetSpawn> CreateNetSpawn(FlatBufferBuilder builder,
      StringOffset nameOffset = default(StringOffset),
      StringOffset shipOffset = default(StringOffset),
      StringOffset colorOffset = default(StringOffset),
      StringOffset tokenOffset = default(StringOffset)) {
    builder.StartObject(4);
    NetSpawn.AddToken(builder, tokenOffset);
    NetSpawn.AddColor(builder, colorOffset);
    NetSpawn.AddShip(builder, shipOffset);
    NetSpawn.AddName(builder, nameOffset);
    return NetSpawn.EndNetSpawn(builder);
  }

  public static void StartNetSpawn(FlatBufferBuilder builder) { builder.StartObject(4); }
  public static void AddName(FlatBufferBuilder builder, StringOffset nameOffset) { builder.AddOffset(0, nameOffset.Value, 0); }
  public static void AddShip(FlatBufferBuilder builder, StringOffset shipOffset) { builder.AddOffset(1, shipOffset.Value, 0); }
  public static void AddColor(FlatBufferBuilder builder, StringOffset colorOffset) { builder.AddOffset(2, colorOffset.Value, 0); }
  public static void AddToken(FlatBufferBuilder builder, StringOffset tokenOffset) { builder.AddOffset(3, tokenOffset.Value, 0); }
  public static Offset<NetSpawn> EndNetSpawn(FlatBufferBuilder builder) {
    int o = builder.EndObject();
    return new Offset<NetSpawn>(o);
  }
};

public struct NetControlInput : IFlatbufferObject
{
  private Table __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public static NetControlInput GetRootAsNetControlInput(ByteBuffer _bb) { return GetRootAsNetControlInput(_bb, new NetControlInput()); }
  public static NetControlInput GetRootAsNetControlInput(ByteBuffer _bb, NetControlInput obj) { return (obj.__assign(_bb.GetInt(_bb.Position) + _bb.Position, _bb)); }
  public void __init(int _i, ByteBuffer _bb) { __p.bb_pos = _i; __p.bb = _bb; }
  public NetControlInput __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public float Angle { get { int o = __p.__offset(4); return o != 0 ? __p.bb.GetFloat(o + __p.bb_pos) : (float)0.0f; } }
  public float X { get { int o = __p.__offset(6); return o != 0 ? __p.bb.GetFloat(o + __p.bb_pos) : (float)0.0f; } }
  public float Y { get { int o = __p.__offset(8); return o != 0 ? __p.bb.GetFloat(o + __p.bb_pos) : (float)0.0f; } }
  public bool Boost { get { int o = __p.__offset(10); return o != 0 ? 0!=__p.bb.Get(o + __p.bb_pos) : (bool)false; } }
  public bool Shoot { get { int o = __p.__offset(12); return o != 0 ? 0!=__p.bb.Get(o + __p.bb_pos) : (bool)false; } }

  public static Offset<NetControlInput> CreateNetControlInput(FlatBufferBuilder builder,
      float angle = 0.0f,
      float x = 0.0f,
      float y = 0.0f,
      bool boost = false,
      bool shoot = false) {
    builder.StartObject(5);
    NetControlInput.AddY(builder, y);
    NetControlInput.AddX(builder, x);
    NetControlInput.AddAngle(builder, angle);
    NetControlInput.AddShoot(builder, shoot);
    NetControlInput.AddBoost(builder, boost);
    return NetControlInput.EndNetControlInput(builder);
  }

  public static void StartNetControlInput(FlatBufferBuilder builder) { builder.StartObject(5); }
  public static void AddAngle(FlatBufferBuilder builder, float angle) { builder.AddFloat(0, angle, 0.0f); }
  public static void AddX(FlatBufferBuilder builder, float x) { builder.AddFloat(1, x, 0.0f); }
  public static void AddY(FlatBufferBuilder builder, float y) { builder.AddFloat(2, y, 0.0f); }
  public static void AddBoost(FlatBufferBuilder builder, bool boost) { builder.AddBool(3, boost, false); }
  public static void AddShoot(FlatBufferBuilder builder, bool shoot) { builder.AddBool(4, shoot, false); }
  public static Offset<NetControlInput> EndNetControlInput(FlatBufferBuilder builder) {
    int o = builder.EndObject();
    return new Offset<NetControlInput>(o);
  }
};

public struct NetPing : IFlatbufferObject
{
  private Table __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public static NetPing GetRootAsNetPing(ByteBuffer _bb) { return GetRootAsNetPing(_bb, new NetPing()); }
  public static NetPing GetRootAsNetPing(ByteBuffer _bb, NetPing obj) { return (obj.__assign(_bb.GetInt(_bb.Position) + _bb.Position, _bb)); }
  public void __init(int _i, ByteBuffer _bb) { __p.bb_pos = _i; __p.bb = _bb; }
  public NetPing __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public uint Time { get { int o = __p.__offset(4); return o != 0 ? __p.bb.GetUint(o + __p.bb_pos) : (uint)0; } }

  public static Offset<NetPing> CreateNetPing(FlatBufferBuilder builder,
      uint time = 0) {
    builder.StartObject(1);
    NetPing.AddTime(builder, time);
    return NetPing.EndNetPing(builder);
  }

  public static void StartNetPing(FlatBufferBuilder builder) { builder.StartObject(1); }
  public static void AddTime(FlatBufferBuilder builder, uint time) { builder.AddUint(0, time, 0); }
  public static Offset<NetPing> EndNetPing(FlatBufferBuilder builder) {
    int o = builder.EndObject();
    return new Offset<NetPing>(o);
  }
};

public struct NetWorldView : IFlatbufferObject
{
  private Table __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public static NetWorldView GetRootAsNetWorldView(ByteBuffer _bb) { return GetRootAsNetWorldView(_bb, new NetWorldView()); }
  public static NetWorldView GetRootAsNetWorldView(ByteBuffer _bb, NetWorldView obj) { return (obj.__assign(_bb.GetInt(_bb.Position) + _bb.Position, _bb)); }
  public void __init(int _i, ByteBuffer _bb) { __p.bb_pos = _i; __p.bb = _bb; }
  public NetWorldView __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public uint Time { get { int o = __p.__offset(4); return o != 0 ? __p.bb.GetUint(o + __p.bb_pos) : (uint)0; } }
  public NetBody? Camera { get { int o = __p.__offset(6); return o != 0 ? (NetBody?)(new NetBody()).__assign(o + __p.bb_pos, __p.bb) : null; } }
  public bool IsAlive { get { int o = __p.__offset(8); return o != 0 ? 0!=__p.bb.Get(o + __p.bb_pos) : (bool)true; } }
  public NetBody? Updates(int j) { int o = __p.__offset(10); return o != 0 ? (NetBody?)(new NetBody()).__assign(__p.__vector(o) + j * 28, __p.bb) : null; }
  public int UpdatesLength { get { int o = __p.__offset(10); return o != 0 ? __p.__vector_len(o) : 0; } }
  public uint Deletes(int j) { int o = __p.__offset(12); return o != 0 ? __p.bb.GetUint(__p.__vector(o) + j * 4) : (uint)0; }
  public int DeletesLength { get { int o = __p.__offset(12); return o != 0 ? __p.__vector_len(o) : 0; } }
#if ENABLE_SPAN_T
  public Span<byte> GetDeletesBytes() { return __p.__vector_as_span(12); }
#else
  public ArraySegment<byte>? GetDeletesBytes() { return __p.__vector_as_arraysegment(12); }
#endif
  public NetGroup? Groups(int j) { int o = __p.__offset(14); return o != 0 ? (NetGroup?)(new NetGroup()).__assign(__p.__indirect(__p.__vector(o) + j * 4), __p.bb) : null; }
  public int GroupsLength { get { int o = __p.__offset(14); return o != 0 ? __p.__vector_len(o) : 0; } }
  public uint GroupDeletes(int j) { int o = __p.__offset(16); return o != 0 ? __p.bb.GetUint(__p.__vector(o) + j * 4) : (uint)0; }
  public int GroupDeletesLength { get { int o = __p.__offset(16); return o != 0 ? __p.__vector_len(o) : 0; } }
#if ENABLE_SPAN_T
  public Span<byte> GetGroupDeletesBytes() { return __p.__vector_as_span(16); }
#else
  public ArraySegment<byte>? GetGroupDeletesBytes() { return __p.__vector_as_arraysegment(16); }
#endif
  public NetAnnouncement? Announcements(int j) { int o = __p.__offset(18); return o != 0 ? (NetAnnouncement?)(new NetAnnouncement()).__assign(__p.__indirect(__p.__vector(o) + j * 4), __p.bb) : null; }
  public int AnnouncementsLength { get { int o = __p.__offset(18); return o != 0 ? __p.__vector_len(o) : 0; } }

  public static void StartNetWorldView(FlatBufferBuilder builder) { builder.StartObject(8); }
  public static void AddTime(FlatBufferBuilder builder, uint time) { builder.AddUint(0, time, 0); }
  public static void AddCamera(FlatBufferBuilder builder, Offset<NetBody> cameraOffset) { builder.AddStruct(1, cameraOffset.Value, 0); }
  public static void AddIsAlive(FlatBufferBuilder builder, bool isAlive) { builder.AddBool(2, isAlive, true); }
  public static void AddUpdates(FlatBufferBuilder builder, VectorOffset updatesOffset) { builder.AddOffset(3, updatesOffset.Value, 0); }
  public static void StartUpdatesVector(FlatBufferBuilder builder, int numElems) { builder.StartVector(28, numElems, 4); }
  public static void AddDeletes(FlatBufferBuilder builder, VectorOffset deletesOffset) { builder.AddOffset(4, deletesOffset.Value, 0); }
  public static VectorOffset CreateDeletesVector(FlatBufferBuilder builder, uint[] data) { builder.StartVector(4, data.Length, 4); for (int i = data.Length - 1; i >= 0; i--) builder.AddUint(data[i]); return builder.EndVector(); }
  public static void StartDeletesVector(FlatBufferBuilder builder, int numElems) { builder.StartVector(4, numElems, 4); }
  public static void AddGroups(FlatBufferBuilder builder, VectorOffset groupsOffset) { builder.AddOffset(5, groupsOffset.Value, 0); }
  public static VectorOffset CreateGroupsVector(FlatBufferBuilder builder, Offset<NetGroup>[] data) { builder.StartVector(4, data.Length, 4); for (int i = data.Length - 1; i >= 0; i--) builder.AddOffset(data[i].Value); return builder.EndVector(); }
  public static void StartGroupsVector(FlatBufferBuilder builder, int numElems) { builder.StartVector(4, numElems, 4); }
  public static void AddGroupDeletes(FlatBufferBuilder builder, VectorOffset groupDeletesOffset) { builder.AddOffset(6, groupDeletesOffset.Value, 0); }
  public static VectorOffset CreateGroupDeletesVector(FlatBufferBuilder builder, uint[] data) { builder.StartVector(4, data.Length, 4); for (int i = data.Length - 1; i >= 0; i--) builder.AddUint(data[i]); return builder.EndVector(); }
  public static void StartGroupDeletesVector(FlatBufferBuilder builder, int numElems) { builder.StartVector(4, numElems, 4); }
  public static void AddAnnouncements(FlatBufferBuilder builder, VectorOffset announcementsOffset) { builder.AddOffset(7, announcementsOffset.Value, 0); }
  public static VectorOffset CreateAnnouncementsVector(FlatBufferBuilder builder, Offset<NetAnnouncement>[] data) { builder.StartVector(4, data.Length, 4); for (int i = data.Length - 1; i >= 0; i--) builder.AddOffset(data[i].Value); return builder.EndVector(); }
  public static void StartAnnouncementsVector(FlatBufferBuilder builder, int numElems) { builder.StartVector(4, numElems, 4); }
  public static Offset<NetWorldView> EndNetWorldView(FlatBufferBuilder builder) {
    int o = builder.EndObject();
    return new Offset<NetWorldView>(o);
  }
};

public struct NetGroup : IFlatbufferObject
{
  private Table __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public static NetGroup GetRootAsNetGroup(ByteBuffer _bb) { return GetRootAsNetGroup(_bb, new NetGroup()); }
  public static NetGroup GetRootAsNetGroup(ByteBuffer _bb, NetGroup obj) { return (obj.__assign(_bb.GetInt(_bb.Position) + _bb.Position, _bb)); }
  public void __init(int _i, ByteBuffer _bb) { __p.bb_pos = _i; __p.bb = _bb; }
  public NetGroup __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public uint Group { get { int o = __p.__offset(4); return o != 0 ? __p.bb.GetUint(o + __p.bb_pos) : (uint)0; } }
  public byte Type { get { int o = __p.__offset(6); return o != 0 ? __p.bb.Get(o + __p.bb_pos) : (byte)0; } }
  public string Caption { get { int o = __p.__offset(8); return o != 0 ? __p.__string(o + __p.bb_pos) : null; } }
#if ENABLE_SPAN_T
  public Span<byte> GetCaptionBytes() { return __p.__vector_as_span(8); }
#else
  public ArraySegment<byte>? GetCaptionBytes() { return __p.__vector_as_arraysegment(8); }
#endif
  public uint Zindex { get { int o = __p.__offset(10); return o != 0 ? __p.bb.GetUint(o + __p.bb_pos) : (uint)0; } }

  public static Offset<NetGroup> CreateNetGroup(FlatBufferBuilder builder,
      uint group = 0,
      byte type = 0,
      StringOffset captionOffset = default(StringOffset),
      uint zindex = 0) {
    builder.StartObject(4);
    NetGroup.AddZindex(builder, zindex);
    NetGroup.AddCaption(builder, captionOffset);
    NetGroup.AddGroup(builder, group);
    NetGroup.AddType(builder, type);
    return NetGroup.EndNetGroup(builder);
  }

  public static void StartNetGroup(FlatBufferBuilder builder) { builder.StartObject(4); }
  public static void AddGroup(FlatBufferBuilder builder, uint group) { builder.AddUint(0, group, 0); }
  public static void AddType(FlatBufferBuilder builder, byte type) { builder.AddByte(1, type, 0); }
  public static void AddCaption(FlatBufferBuilder builder, StringOffset captionOffset) { builder.AddOffset(2, captionOffset.Value, 0); }
  public static void AddZindex(FlatBufferBuilder builder, uint zindex) { builder.AddUint(3, zindex, 0); }
  public static Offset<NetGroup> EndNetGroup(FlatBufferBuilder builder) {
    int o = builder.EndObject();
    return new Offset<NetGroup>(o);
  }
};

public struct Vec2 : IFlatbufferObject
{
  private Struct __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public void __init(int _i, ByteBuffer _bb) { __p.bb_pos = _i; __p.bb = _bb; }
  public Vec2 __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public short X { get { return __p.bb.GetShort(__p.bb_pos + 0); } }
  public short Y { get { return __p.bb.GetShort(__p.bb_pos + 2); } }

  public static Offset<Vec2> CreateVec2(FlatBufferBuilder builder, short X, short Y) {
    builder.Prep(2, 4);
    builder.PutShort(Y);
    builder.PutShort(X);
    return new Offset<Vec2>(builder.Offset);
  }
};

public struct NetBody : IFlatbufferObject
{
  private Struct __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public void __init(int _i, ByteBuffer _bb) { __p.bb_pos = _i; __p.bb = _bb; }
  public NetBody __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public uint Id { get { return __p.bb.GetUint(__p.bb_pos + 0); } }
  public uint DefinitionTime { get { return __p.bb.GetUint(__p.bb_pos + 4); } }
  public Vec2 OriginalPosition { get { return (new Vec2()).__assign(__p.bb_pos + 8, __p.bb); } }
  public Vec2 Velocity { get { return (new Vec2()).__assign(__p.bb_pos + 12, __p.bb); } }
  public sbyte OriginalAngle { get { return __p.bb.GetSbyte(__p.bb_pos + 16); } }
  public sbyte AngularVelocity { get { return __p.bb.GetSbyte(__p.bb_pos + 17); } }
  public byte Size { get { return __p.bb.Get(__p.bb_pos + 18); } }
  public byte Sprite { get { return __p.bb.Get(__p.bb_pos + 19); } }
  public byte Mode { get { return __p.bb.Get(__p.bb_pos + 20); } }
  public uint Group { get { return __p.bb.GetUint(__p.bb_pos + 24); } }

  public static Offset<NetBody> CreateNetBody(FlatBufferBuilder builder, uint Id, uint DefinitionTime, short originalPosition_X, short originalPosition_Y, short velocity_X, short velocity_Y, sbyte OriginalAngle, sbyte AngularVelocity, byte Size, byte Sprite, byte Mode, uint Group) {
    builder.Prep(4, 28);
    builder.PutUint(Group);
    builder.Pad(3);
    builder.PutByte(Mode);
    builder.PutByte(Sprite);
    builder.PutByte(Size);
    builder.PutSbyte(AngularVelocity);
    builder.PutSbyte(OriginalAngle);
    builder.Prep(2, 4);
    builder.PutShort(velocity_Y);
    builder.PutShort(velocity_X);
    builder.Prep(2, 4);
    builder.PutShort(originalPosition_Y);
    builder.PutShort(originalPosition_X);
    builder.PutUint(DefinitionTime);
    builder.PutUint(Id);
    return new Offset<NetBody>(builder.Offset);
  }
};

public struct NetAnnouncement : IFlatbufferObject
{
  private Table __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public static NetAnnouncement GetRootAsNetAnnouncement(ByteBuffer _bb) { return GetRootAsNetAnnouncement(_bb, new NetAnnouncement()); }
  public static NetAnnouncement GetRootAsNetAnnouncement(ByteBuffer _bb, NetAnnouncement obj) { return (obj.__assign(_bb.GetInt(_bb.Position) + _bb.Position, _bb)); }
  public void __init(int _i, ByteBuffer _bb) { __p.bb_pos = _i; __p.bb = _bb; }
  public NetAnnouncement __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public string Text { get { int o = __p.__offset(4); return o != 0 ? __p.__string(o + __p.bb_pos) : null; } }
#if ENABLE_SPAN_T
  public Span<byte> GetTextBytes() { return __p.__vector_as_span(4); }
#else
  public ArraySegment<byte>? GetTextBytes() { return __p.__vector_as_arraysegment(4); }
#endif

  public static Offset<NetAnnouncement> CreateNetAnnouncement(FlatBufferBuilder builder,
      StringOffset textOffset = default(StringOffset)) {
    builder.StartObject(1);
    NetAnnouncement.AddText(builder, textOffset);
    return NetAnnouncement.EndNetAnnouncement(builder);
  }

  public static void StartNetAnnouncement(FlatBufferBuilder builder) { builder.StartObject(1); }
  public static void AddText(FlatBufferBuilder builder, StringOffset textOffset) { builder.AddOffset(0, textOffset.Value, 0); }
  public static Offset<NetAnnouncement> EndNetAnnouncement(FlatBufferBuilder builder) {
    int o = builder.EndObject();
    return new Offset<NetAnnouncement>(o);
  }
};

public struct NetQuantum : IFlatbufferObject
{
  private Table __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public static NetQuantum GetRootAsNetQuantum(ByteBuffer _bb) { return GetRootAsNetQuantum(_bb, new NetQuantum()); }
  public static NetQuantum GetRootAsNetQuantum(ByteBuffer _bb, NetQuantum obj) { return (obj.__assign(_bb.GetInt(_bb.Position) + _bb.Position, _bb)); }
  public void __init(int _i, ByteBuffer _bb) { __p.bb_pos = _i; __p.bb = _bb; }
  public NetQuantum __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public AllMessages MessageType { get { int o = __p.__offset(4); return o != 0 ? (AllMessages)__p.bb.Get(o + __p.bb_pos) : AllMessages.NONE; } }
  public TTable? Message<TTable>() where TTable : struct, IFlatbufferObject { int o = __p.__offset(6); return o != 0 ? (TTable?)__p.__union<TTable>(o) : null; }

  public static Offset<NetQuantum> CreateNetQuantum(FlatBufferBuilder builder,
      AllMessages message_type = AllMessages.NONE,
      int messageOffset = 0) {
    builder.StartObject(2);
    NetQuantum.AddMessage(builder, messageOffset);
    NetQuantum.AddMessageType(builder, message_type);
    return NetQuantum.EndNetQuantum(builder);
  }

  public static void StartNetQuantum(FlatBufferBuilder builder) { builder.StartObject(2); }
  public static void AddMessageType(FlatBufferBuilder builder, AllMessages messageType) { builder.AddByte(0, (byte)messageType, 0); }
  public static void AddMessage(FlatBufferBuilder builder, int messageOffset) { builder.AddOffset(1, messageOffset, 0); }
  public static Offset<NetQuantum> EndNetQuantum(FlatBufferBuilder builder) {
    int o = builder.EndObject();
    return new Offset<NetQuantum>(o);
  }
  public static void FinishNetQuantumBuffer(FlatBufferBuilder builder, Offset<NetQuantum> offset) { builder.Finish(offset.Value); }
  public static void FinishSizePrefixedNetQuantumBuffer(FlatBufferBuilder builder, Offset<NetQuantum> offset) { builder.FinishSizePrefixed(offset.Value); }
};


}
